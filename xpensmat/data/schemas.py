# xpensmat/data/schemas.py
from pydantic import BaseModel
from typing import Optional

class Transaction(BaseModel):
    id: Optional[int]
    timestamp: str
    source: str
    raw_json: str
    amount: Optional[float]
    category: Optional[str]

class Prediction(BaseModel):
    id: Optional[int]
    txn_id: int
    predicted_amount: float
    model_name: str
