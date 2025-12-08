from typing import List, Dict
from datetime import datetime,timezone

from app.models.alert_model import Alert

# PATTERNS

SQLI_PATTERNS = [
    " or 1=1", " or '1'='1", " union select", " drop table",
    "'--", "\"--", "# ", " sleep(", " benchmark(", " information_schema"
]

XSS_PATTERNS = [
    "<script", "javascript:", "onerror=", "onload=", "onmouseover="
]

PATH_TRAVERSAL_PATTERNS = [
    "../", "..\\", "%2e%2e%2f", "%2e%2e\\", "/etc/passwd", "c:\\windows"
]

SENSITIVE_ENDPOINTS = [
    "/admin", "/admin/", "/config", "/config/", "/server-status",
    "/phpmyadmin", "/wp-admin", "/.env", "/.git"
]

ERROR_STATUS_CODES = {400, 401, 403, 404, 500, 502, 503}


def create_alert(alert_type: str, risk: str, description: str, log: Dict) -> Dict:
    alert = Alert(
        alert_type=alert_type,
        ip=log.get("ip"),
        risk=risk,
        description=description,
        timestamp=datetime.now(timezone.utc),
        details={
            "endpoint": log.get("endpoint"),
            "status": log.get("status"),
            "raw": log.get("raw", "")[:300],
        }
    )
    return alert.model_dump()


def run_detection(parsed_logs: List[Dict]) -> List[Dict]:
    alerts: List[Dict] = []

    # State for threshold-based rules
    failed_logins_by_ip: Dict[str, int] = {}
    requests_by_ip: Dict[str, int] = {}
    error_count: int = 0

    for log in parsed_logs:
        ip = log.get("ip") or "UNKNOWN"
        endpoint = (log.get("endpoint") or "").lower()
        raw = (log.get("raw") or "").lower()
        status = log.get("status")

        # Count requests per IP
        requests_by_ip[ip] = requests_by_ip.get(ip, 0) + 1
        if status in ERROR_STATUS_CODES:
            error_count += 1

        # 1. BRUTE-FORCE DETECTION
        if status == 401 or "failed login" in raw:
            failed_logins_by_ip[ip] = failed_logins_by_ip.get(ip, 0) + 1

            if failed_logins_by_ip[ip] == 5:  # threshold
                alerts.append(
                    create_alert(
                        alert_type="Brute Force Attack Suspected",
                        risk="High",
                        description=f"More than 5 failed login attempts from IP {ip}.",
                        log=log
                    )
                )

        # 2. SQL INJECTION DETECTION
        combined_text = (endpoint + " " + raw).lower()
        if any(pattern in combined_text for pattern in SQLI_PATTERNS):
            alerts.append(
                create_alert(
                    alert_type="SQL Injection Attempt",
                    risk="Critical",
                    description=f"Possible SQL injection from IP {ip} on {endpoint}.",
                    log=log
                )
            )

        # 3. XSS DETECTION
        if any(pattern in combined_text for pattern in XSS_PATTERNS):
            alerts.append(
                create_alert(
                    alert_type="Cross-Site Scripting (XSS) Attempt",
                    risk="High",
                    description=f"Possible XSS attempt from IP {ip} on {endpoint}.",
                    log=log
                )
            )

        # 4. PATH TRAVERSAL DETECTION
        if any(pattern in combined_text for pattern in PATH_TRAVERSAL_PATTERNS):
            alerts.append(
                create_alert(
                    alert_type="Path Traversal Attack",
                    risk="High",
                    description=f"Path traversal pattern detected from IP {ip}.",
                    log=log
                )
            )

        # 5. SENSITIVE ENDPOINT ACCESS
        for se in SENSITIVE_ENDPOINTS:
            if endpoint.startswith(se):
                alerts.append(
                    create_alert(
                        alert_type="Sensitive Endpoint Access",
                        risk="Medium",
                        description=f"Access to sensitive endpoint '{endpoint}' from IP {ip}.",
                        log=log
                    )
                )
                break

        # 6. BASIC HIGH ERROR SPIKE (PER BATCH)
        # If more than 20% of lines are errors, raise alert once at the end.
    # After processing all logs - check global conditions

    total_logs = len(parsed_logs)
    if total_logs > 0 and error_count / total_logs > 0.2:
        alerts.append(
            {
                "alert_type": "High Error Rate",
                "ip": None,
                "risk": "Medium",
                "description": f"More than 20% of requests resulted in error codes. "
                               f"Errors: {error_count}, Total: {total_logs}",
                "timestamp": datetime.now(timezone.utc),
                "details": {}
            }
        )

    return alerts
