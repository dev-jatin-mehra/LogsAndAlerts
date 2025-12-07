from typing import List
from app.models.log_model import ParsedLog
from datetime import datetime,timezone

def parse_log_file(file_text : str) -> List[dict]:
    """
    Takes raw log file text and returns list of parsed log dicts.
    For now, we assume each line is: TIMESTAMP IP METHOD ENDPOINT STATUS
    We'll improve later for Apache, Nginx, etc.
    """

    parsed_logs = []

    lines = file_text.splitlines()

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # TODO: Replace with real parsing logic later
        # TEMP DUMMY: treat whole line as raw, fake timestamp
        log = ParsedLog(
            ip=None,
            method=None,
            endpoint=None,
            status=None,
            timstamp=datetime.now(timezone.utc),
            raw=line
        )

        parsed_logs.append(log.model_dump()) # previous : log.dict()

    return parsed_logs
