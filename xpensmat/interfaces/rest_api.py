# xpensmat/interfaces/rest_api.py
"""
FastAPI REST endpoints for XPenSmat
"""
from fastapi import FastAPI, HTTPException
from xpensmat.core.logger import logger
from xpensmat.data.db import db
from xpensmat.nlp_engine.chatbot import ChatBot
from xpensmat.predictor.serve import predict_for_txn
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="XPenSmat API")
bot = ChatBot()

class PredictRequest(BaseModel):
    txn_id: int

class ChatRequest(BaseModel):
    message: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(req: PredictRequest):
    rows = db.list_transactions(limit=1000)
    # find txn by id
    txn = None
    for r in rows:
        if r[0] == req.txn_id:
            txn = r
            break
    if not txn:
        raise HTTPException(status_code=404, detail="txn not found")
    pred = predict_for_txn(txn)
    return {"txn_id": req.txn_id, "predicted_amount": pred}

@app.post("/chat")
def chat(req: ChatRequest):
    resp = bot.handle_text(req.message)
    return {"reply": resp}
