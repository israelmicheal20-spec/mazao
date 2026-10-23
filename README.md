# Mazao

Mazao is an AI-powered produce quality verification and marketplace platform for farmers and buyers. It helps farmers upload produce data and images, evaluate freshness and shelf life, and connect to buyers through a marketplace.

## Stack
- Frontend: Next.js + TypeScript
- Backend: FastAPI + Python
- Database: PostgreSQL
- Auth: JWT
- AI: OpenCV + Python-based quality heuristics

## Features
- Farmer account creation and login
- Produce batch upload with harvest date, storage conditions, and image
- Produce freshness scoring and shelf-life estimation
- Storage advice for humidity, temperature, and sunlight handling
- Marketplace listings and simple order flow
- Farmer dashboard with recent batches

## Local run

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Database
Start PostgreSQL locally or use Docker Compose at the project root.

## Docker
```bash
docker-compose up --build
```

## Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API health: http://localhost:8000/health

## Notes
This is an MVP product foundation. The AI layer is a practical heuristic-based image quality engine and is designed to be upgraded to a trained crop-vision model later.
