# XPenSmat - ML Subproject

This folder contains the modelling and experiment code for XPenSmat:
- data preprocessing,
- dataset utilities,
- baseline and XGBoost models,
- an optional TensorFlow + TensorFlow-Privacy DP model,
- training and prediction scripts,
- notebooks for EDA & model development.

## Quick start

1. Create a virtualenv and install requirements:
    python -m venv .venv
    .venv/bin/activate # or .venv\Scripts\activate on Windows
    pip install -r requirements.txt

2. Put raw CSV(s) in `ml/data/raw/` and run preprocessing:
```bash
    python -m ml.src.preprocessing --input ml/data/raw/expenses.csv --out ml/data/processed/transactions.parquet
```
3. Train the model:
```bash
    python -m ml.src.train --data ml/data/processed/transactions.parquet --out experiments/xgb_model.joblib
```
4. Predict:
```bash
    python -m ml.src.predict --model experiments/xgb_model.joblib --input new.csv --out preds.csv


