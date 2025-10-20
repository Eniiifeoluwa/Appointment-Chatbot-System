# Appointment Chatbot System (Local, No Docker)

This archive contains a minimal, runnable scaffold for an appointment-scheduling chatbot:
- Frontend: Next.js (pages + components)
- Backend: Node.js + Express
- Python Microservice: FastAPI (+ LangChain placeholders)
- Database schema: PostgreSQL SQL file

IMPORTANT:
- Fill in secrets in `.env` files before running.
- This is a developer scaffold. Adjust versions and install deps locally.

## Quick start (example)
1. Start PostgreSQL and create database `appt_chatbot`.
2. Run SQL schema: `psql -d appt_chatbot -f db/schema.sql`

Backend:
- cd backend
- npm install
- create .env (see .env.example)
- npm run dev

Python microservice:
- cd python-ms
- python -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt
- uvicorn app:app --reload --port 5000

Frontend:
- cd frontend
- npm install
- npm run dev

The frontend expects the backend at http://localhost:4000 and the python microservice at http://localhost:5000
