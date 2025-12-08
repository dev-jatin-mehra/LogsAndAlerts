from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ParsedLog(BaseModel):
    ip : Optional[str] = None
    method : Optional[str] = None
    endpoint : Optional[str] = None
    status : Optional[int] = None
    timestamp : datetime
    raw : str # original line