from typing import List, Dict
from datetime import datetime,timezone
from app.models.alert_model import Alert

def run_detection(parsed_logs : List[Dict])->List[Dict]:
    """
    Takes list of parsed log dicts and returns list of alert dicts.
    """
    alerts : List[Dict] = []

    # Example: VERY simple demo rule – mark lines containing "ERROR"
    for log in parsed_logs:
        raw = log.get("raw","")

        if "ERROR" in raw or "Failed login" in raw :
            alert = Alert(
                alert_type="Simple Error Detection",
                ip = log.get("ip"),
                risk="Medium",
                description=f"Suspicious log line detected: {raw[:80]}",
                timestamp=datetime.now(timezone.utc),
                details={"raw" : raw}
            )

            alerts.append(alert.model_dump()) # history : alert.dict()

    return alerts