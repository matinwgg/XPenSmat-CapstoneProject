FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN groupadd --system app && useradd --system --gid app --home-dir /app app \
    && mkdir -p /app/data /app/reports /app/experiments/models \
    && chown -R app:app /app

COPY pyproject.toml README.md ./
COPY xpensmat/ ./xpensmat/

RUN pip install --no-cache-dir ".[api,reports]"

USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD python -c "from urllib.request import urlopen; urlopen('http://127.0.0.1:8080/health', timeout=2)"

CMD ["uvicorn", "xpensmat.interfaces.rest_api:app", "--host", "0.0.0.0", "--port", "8080"]
