# xpensmat/data/schemas.py
from typing import Optional

from pydantic import BaseModel


class Transaction(BaseModel):
    id: Optional[int] = None
    timestamp: str
    source: str
    raw_json: str
    amount: Optional[float] = None
    category: Optional[str] = None


class Prediction(BaseModel):
    id: Optional[int] = None
    txn_id: int
    predicted_amount: float
    model_name: str
