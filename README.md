# XPenSmat

XPenSmat is a personal finance capstone project with an Expo mobile client and
a Python service for transaction ingestion, local persistence, prediction,
reporting, and natural language helpers. Financial records are sensitive, so
the project is designed around local data ownership and explicit Appwrite
document permissions.

## Repository layout

```text
.
├── xpensmat/                 # Installable Python application package
│   ├── appwrite_backend/     # Appwrite adapter boundary
│   ├── core/                 # Configuration, security, orchestration
│   ├── data/                  # SQLite, schemas, ingestion, sync
│   ├── export/                # PDF and DOCX report generation
│   ├── interfaces/            # CLI, REST API, mobile bridge
│   ├── nlp_engine/            # Intent parsing and chat helpers
│   └── predictor/             # Model training, serving, evaluation
├── apps/mobile/                # Expo Router app and Android project
├── ml/                        # Separate ML research and experiment package
├── core/                      # Compatibility import for older crypto callers
├── infra/                     # Docker image, Compose and deployment notes
├── experiments/               # Local model artifacts and experiment outputs
├── reports/                    # Generated reports (local runtime output)
└── pyproject.toml              # Python packaging and tool configuration
```

## Development setup

Use Python 3.11 or newer and Node.js compatible with Expo SDK 51.

### Python service

```sh
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux:        source .venv/bin/activate
python -m pip install -e ".[api,reports]"
```

Copy `xpensmat/.env.example` to `.env` in the repository root or export the
variables in your shell. The local data store defaults to `./data/xpensmat.db` relative to
the current working directory. Run the service from the repository root:

```sh
uvicorn xpensmat.interfaces.rest_api:app --reload
```

The API listens on `http://127.0.0.1:8000` and exposes `/health`, `/predict`,
and `/chat`.

### Mobile application

```sh
cd apps/mobile
npm ci
npm --prefix testing ci
npm start
```

Use the Expo development client or the Android/iOS scripts in the mobile
package manifest. Appwrite project IDs and the public endpoint are configured
in `lib/appwrite.js`; private API keys must never be added to the mobile app.

### Appwrite schema

The Appwrite CLI manifest is in the repository root and mirrored beside the
mobile app. See [infra/README.md](infra/README.md) for the schema, ownership
rules, and deployment commands.

## Python commands

The package installs the `xpensmat` command. For example:

```sh
xpensmat --train
xpensmat --predict transactions.csv --out predictions.csv
python -m xpensmat.interfaces.cli --ingest-sms
```

Research experiments use a separate optional dependency set:

```sh
python -m pip install -e ".[research]"
python -m ml.src.train --help
```

## Quality checks

```sh
# Python test and lint dependencies
python -m pip install -e ".[test,dev]"
python -m pytest
ruff check .
ruff format --check .

# Mobile checks
cd apps/mobile
npm test
```

## Runtime boundaries

- The Python database is SQLite. Appwrite authentication, functions, and
  synchronization adapters under `xpensmat/appwrite_backend/` are currently
  placeholders; configuring the endpoint does not make those adapters live.
- The mobile client uses Appwrite directly. Its profile and expense documents
  receive owner-only read, update, and delete permissions.
- ML research dependencies, raw datasets, trained models, and generated
  reports are kept separate from the mobile bundle and are not required to
  start the API.
- `core.security` remains as a compatibility import. New code should import
  security helpers from `xpensmat.core.security`.

## Security and data handling

Do not commit `.env` files, API keys, private financial records, exported
reports, or production model artifacts. Keep backups and exports access
controlled. See [ASSESSMENT.md](ASSESSMENT.md) for the recorded project
assessment and known limitations.
