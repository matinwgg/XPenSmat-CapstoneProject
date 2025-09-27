# Base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (both app + ML)
COPY ./ml/requirements.txt /tmp/requirements.txt
COPY ./app/requirements.txt /tmp/app_requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt \
    && pip install --no-cache-dir -r /tmp/app_requirements.txt

# Copy code
COPY . .

# Default command: start API (adjust as needed)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
