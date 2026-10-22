# XPenSmat — Intelligent Expense Management for Ghanaian FinTech

## About

XPenSmat is a capstone project exploring intelligent personal-finance management in a Ghanaian/FinTech context. It combines financial-data ingestion, local storage, expense categorisation and prediction, natural-language interaction, export, synchronisation, and a mobile application layer.

### Why it exists

Personal-finance software must combine useful intelligence with strong protection of highly sensitive financial data. XPenSmat explores how mobile engineering, machine learning, data modelling, and secure financial-data handling can work together.

## Features

- SMS and bank-transaction ingestion
- Expense categorisation and prediction
- Local financial-data storage
- ML/NLP-assisted interaction
- Data export
- Appwrite synchronisation
- Android/mobile application layer
- Separate `ml/` research and training components

## Tech Stack

- React Native / Expo mobile tooling
- JavaScript/TypeScript components present in the application
- Appwrite services
- Machine-learning components under `ml/`
- Android/Gradle build tooling

## Architecture

```text
Financial inputs
      ↓
Ingestion + normalization
      ↓
Local financial state
      ├── Expense analytics / ML
      ├── NLP interaction
      └── Export
      ↓
Authenticated synchronization
      ↓
Appwrite-backed services
```

## Project Structure

```text
.
├── xpensmat/            # Application package (ingestion, DB, predictor, API, CLI)
│   ├── predictor/       # Baseline predictor shipped with the app
│   └── tests/
├── ml/                  # ML/training/research components
├── existing_app_files/  # Mobile application source and Android project
├── experiments/         # Model artifacts and metrics
├── infra/               # Docker and deployment helpers
└── README.md
```

## Prerequisites

- Python 3.10+
- Node.js compatible with the project's Expo/React Native version
- npm/yarn
- Android Studio for Android development
- Android SDK / emulator or physical device
- Appwrite project for synchronisation features

## Getting Started

```bash
git clone https://github.com/matinwgg/XPenSmat-CapstoneProject.git
cd XPenSmat-CapstoneProject

python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Optional extras:

```bash
pip install -e ".[api,export]"   # FastAPI service + PDF/DOCX export
pip install -e ".[ml]"           # scikit-learn/XGBoost research dependencies
```

The mobile app configuration is environment-driven. Copy
`existing_app_files/.env.example` to `existing_app_files/.env` and fill in your
own Appwrite project and collection IDs. The app intentionally has no committed
Appwrite credentials.

## Usage

```bash
# Ingest queued SMS records from data/raw/sample_sms.jsonl
xpensmat --ingest-sms

# Train the application mean baseline from a CSV
xpensmat --train --data transactions.csv --target amount

# Score a CSV (and optionally write predictions)
xpensmat --predict transactions.csv --out predictions.csv

# Evaluate against a CSV with a target column
xpensmat --evaluate transactions.csv --target amount

# Start the background orchestrator
xpensmat --start-orchestrator
```

The original `xpensmat/predictor` submodule was not included in the repository.
The app now ships a deterministic mean baseline so the CLI, orchestrator, and
API remain functional; use the `ml/` pipeline for real model training.

## Security Considerations

Financial data is sensitive. The project therefore emphasises least-privilege permissions, protected local state, secure authentication, safe synchronisation, release signing, backup policy, and careful export handling. Production use would require a full mobile threat model, cryptographic storage review, privacy assessment, compliance review, and penetration testing.

## Testing

```bash
pytest -q
```

Tests use a temporary database and model directory; they never touch
`data/xpensmat.db` or your home directory. The suite covers SMS amount parsing,
authenticated encryption, ledger/database behaviour, the predictor baseline, the
CLI flow, authentication fail-closed behaviour, and the ML split/feature
pipeline.

## Limitations & Future Work

- The local SQLite database is not encrypted at rest. Use an encrypted SQLite
  build (SQLCipher) or encrypt sensitive columns before storing real data.
- The application predictor is a mean baseline until the missing original
  predictor source is restored; the research pipeline lives in `ml/`.
- Appwrite login fails closed until the SDK integration is implemented.
- Strengthen encrypted local persistence and key management
- Reduce unnecessary Android permissions
- Formalise ML evaluation and uncertainty
- Add privacy-preserving analytics
- Expand end-to-end and mobile tests
- Add production observability and crash/security monitoring

## Contributing

Keep financial-data assumptions explicit, add regression tests for sensitive workflows, and never commit personal financial data or credentials.

## Author

**A. Matin Odoom**
