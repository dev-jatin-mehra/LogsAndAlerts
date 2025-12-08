from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os

from app.services.detection_engine import run_detection
from app.services.log_parser import parse_log_file

router = APIRouter(prefix="/logs",tags=["Logs"])
ALLOWED_EXTENSIONS = {".txt", ".log"}

@router.post("/upload")
async def upload_logs(file:UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400,detail="No File Upoaded")
    
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Only .txt and .log files are allowed."
        )
    content = await file.read()
    text = content.decode(errors="ignore")

    # 1. Parse Log lines -> structured logs
    parsed_logs = parse_log_file(text)

    # 2. Run detection engine on parsed logs
    alerts = run_detection(parsed_logs)

    # 3. Return Error for now : else this is the db step 
    return {
        "message" : "Logs Processed Successfully",
        "total_logs" : len(parsed_logs),
        "total_alerts" : len(alerts),
        "alerts" : alerts,
    }