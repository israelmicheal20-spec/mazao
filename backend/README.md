# Mazao backend

This backend provides authentication, produce quality scoring, and a marketplace API for the Mazao app.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Docker
```bash
docker-compose up --build
```
