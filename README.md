## Logs & Alerts Helper
A clean dashboard tool that analyzes logs and shows alerts

## Features
#### Log Parsing
- Universal hybrid parser
- Supports Apache/Nginx access logs
- Supports custom text logs
- Extracts IP, endpoint, status code,   timestamp, method

#### Detection Engine
- Rule-based engine detects:
- Brute force login attempts
- SQL injection attempts
- XSS payloads
- Path traversal (../)
- Sensitive endpoint access (/admin, /config, /phpmyadmin)
- Error spikes (404/500 floods)
- Unauthorized access patterns

#### Dashboard
- Upload log files
- View security alerts
- Filter alerts (severity, IP, attack type)

## Tech Stack
>Frontend : `React.js` `Tailwind CSS` `Custom Hooks`

>Backend : `Python FastAPI` `Regex-based log parsing` `Rule-based detection engine` `Pydantic` `Uvicorn`

## Installation & Setup
>Check out the internal Readme.md files

## 📡 API Endpoints
1. `POST /api/logs/upload`
2. `Upload a .log file.`
3. `Request: multipart/form-data with file`
4. `Response :`
    ```json
    {
    "message": "Logs processed successfully",
    "total_logs": 45,
    "total_alerts": 6,
    "alerts": [
        {
        "alert_type": "SQL Injection Attempt",
        "ip": "192.168.1.30",
        "risk": "Critical",
        "description": "Possible SQL injection attempt detected.",
        "timestamp": "2025-12-10T09:20:15Z"
        }
    ]
    }
    ```
>Rules are fully configurable in: `backend/app/services/detection_engine.py`

## Testing

Use the sample log files in /logs/samples:
`testA.log, apache.log, rw.log`