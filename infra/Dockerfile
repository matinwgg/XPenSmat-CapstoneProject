# Base image
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Build tools are only needed while installing the Python package.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md ./
COPY xpensmat ./xpensmat
RUN pip install ".[api,export]" \
    && apt-get purge -y --auto-remove build-essential \
    && rm -rf /var/lib/apt/lists/*

# Runtime data. The baseline model keeps the prediction endpoint functional
# even when the optional XGBoost extra is not installed.
COPY experiments/models ./experiments/models
RUN mkdir -p /app/data/raw /app/reports \
    && useradd --create-home --uid 10001 appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8080
CMD ["uvicorn", "xpensmat.interfaces.rest_api:app", "--host", "0.0.0.0", "--port", "8080"]
