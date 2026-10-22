# XPenSmat infrastructure

The backend is a single Python service backed by SQLite. The Docker image
installs the application plus the `api` and `export` extras.

From the repository root:

```bash
docker compose -f infra/docker-compose.yml build
docker compose -f infra/docker-compose.yml up
```

The API is served at `http://localhost:8080` (for example
`/health`, `/transactions`, and `/chat`).

Configuration:

- `XPENSMAT_DB` — SQLite database path (default `/app/data/xpensmat.db`)
- `XPENSMAT_DEMO_MODE` — opt in to synthetic bank transactions (default `false`)
- `APPWRITE_ENDPOINT` / `APPWRITE_PROJECT` — reserved for the AppWrite
  integration; login currently fails closed until that integration is complete.

For local development use `pip install -e ".[dev,api,export]"` and
`python -m xpensmat.interfaces.cli --help`.
