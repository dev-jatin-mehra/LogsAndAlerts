from pydantic import BaseModel
from typing import Optional 
from datetime import datetime

class Alert(BaseModel):
    alert_type : str
    ip : Optional[str] = None
    risk : str
    description : str
    timestamp : datetime
    details : Optional[dict] = None
