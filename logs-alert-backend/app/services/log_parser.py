import re
from typing import List,Dict,Optional
from datetime import datetime,timezone

from app.models.log_model import ParsedLog

#Apache/Nginx Foramt log parsing
APACHE_COMBINED_REGEX = re.compile(
    r'^(?P<ip>\S+)\s'                # IP address
    r'(?P<ident>\S+)\s'              # ident
    r'(?P<user>\S+)\s'
    r'\[(?P<time>.+?)\]\s'           # [10/Oct/2000:13:55:36 -0700]
    r'"(?P<request>.+?)"\s'          # "GET /index.html HTTP/1.1"
    r'(?P<status>\d{3})\s'           # 200
    r'(?P<size>\S+)\s'               # 2326 (bytes)
    r'"(?P<referer>.*?)"\s'          # "http://example.com"
    r'"(?P<user_agent>.*?)"'         # "Mozilla/5.0"
)

def parse_apache_timestamp(ts:str)->datetime:
    return datetime.strptime(ts,"%d/%b/%Y:%H:%M:%S %z")

#General Log Parsing
GENERAL_LOG_REGEX = re.compile(
    r'^(?P<time>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+'
    r'(?P<level>[A-Z]+)\s+'
    r'(?P<message>.*?)(?:\s+from\s+(?P<ip>\d+\.\d+\.\d+\.\d+))?\s*$'
)

def parse_general_timestamp(ts: str) -> datetime:
    return datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")

ENDPOINT_PATTERNS = [
    re.compile(r"GET\s+(?P<endpoint>/\S*)", re.IGNORECASE),
    re.compile(r"Page\s+accessed:\s+(?P<endpoint>/\S*)", re.IGNORECASE),
    re.compile(r"access\s+to\s+(?P<endpoint>/\S*)", re.IGNORECASE),
    re.compile(r"at\s+(?P<endpoint>/\S*)", re.IGNORECASE),
]

STATUS_PATTERN = re.compile(
    r"\b(?P<status>(200|201|301|302|400|401|403|404|500|502|503))\b"
)

#Parser
def parse_log_line(line:str)->Optional[Dict]:
    line = line.strip()
    if not line:
        return None

    match = APACHE_COMBINED_REGEX.match(line)
    if match:
        data = match.groupdict()
        #Method,Endpoint,Protocol
        method, endpoint, protocol = None, None, None
        request = data.get("request") or ""
        parts = request.split()
        if len(parts) >= 3:
            method,endpoint,protocol = parts[0], parts[1], parts[2]
        elif len(parts) == 2:
            method,endpoint = parts[0],parts[1]

        #Status,Size,Timestamp
        try:
            status = int(data.get("status")) #type:ignore
        except (ValueError,TypeError):
            status = None

        try:
            ts = parse_apache_timestamp(data.get("time")) #type:ignore
        except Exception:
            ts = datetime.now(timezone.utc)

        parsed = ParsedLog(
            ip = data.get("ip"),
            method=method,
            endpoint=endpoint,
            status=status,
            timestamp=ts,
            raw=line
        )
        return parsed.model_dump()
    
    #For genral logs

    m_general = GENERAL_LOG_REGEX.match(line)
    if m_general:
        gd = m_general.groupdict()
        msg = gd.get("message") or ""
        ip = gd.get("ip")

        #TS
        try:
            ts = parse_general_timestamp(gd.get("time")) #type:ignore
        except Exception:
            ts = datetime.now(timezone.utc)

        # Extract endpoint from message
        endpoint = None
        for pat in ENDPOINT_PATTERNS:
            m_ep = pat.search(msg)
            if m_ep:
                endpoint = m_ep.group("endpoint")
                break
        
        # Status
        status = None
        m_status = STATUS_PATTERN.search(msg)
        if m_status:
            try:
                status = int(m_status.group("status"))
            except ValueError:
                status = None

        # Heuristic method
        method = None
        if "GET " in msg.upper():
            method = "GET"
        elif "POST " in msg.upper():
            method = "POST"

        parsed = ParsedLog(
            ip=ip,
            method=method,
            endpoint=endpoint,
            status=status,
            timestamp=ts,
            raw=line,
        )
        return parsed.model_dump()

    return ParsedLog(
        ip=None,
        method=None,
        endpoint=None,
        status=None,
        timestamp=datetime.now(timezone.utc),
        raw=line
    ).model_dump()

def parse_log_file(file_text : str) -> List[dict]:
    parsed_logs : List[Dict] = []

    lines = file_text.splitlines()

    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        parsed = parse_log_line(line)
        if parsed:
            parsed_logs.append(parsed)

    return parsed_logs