from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import psycopg
import datetime

load_dotenv()
app = FastAPI()
DB_DSN = os.getenv('DATABASE_URL')

class MessageIn(BaseModel):
    text: str
    userId: int | None = None

@app.post('/api/respond')
async def respond(payload: MessageIn):
    text = payload.text
    user_id = payload.userId
    # Very small rule-based detection
    if any(k in text.lower() for k in ('book', 'appointment', 'schedule')):
        reply, meta = await handle_booking(text, user_id)
    else:
        # fallback static reply; replace with LangChain call for richer behaviour
        reply = "Thanks for your message. I can help schedule appointments — tell me a date and time you'd like."
        meta = {}
    # log chat
    try:
        with psycopg.connect(DB_DSN) as conn:
            with conn.cursor() as cur:
                cur.execute("INSERT INTO chat_sessions (user_id, user_message, assistant_message, created_at) VALUES (%s, %s, %s, now())", (user_id, text, reply))
    except Exception as e:
        print('DB log error', e)
    return { 'reply': reply, 'meta': meta }

async def handle_booking(text: str, user_id: int | None):
    # naive date extraction using dateutil
    from dateutil import parser
    try:
        dt = None
        for part in text.split(','):
            try:
                dt = parser.parse(part, fuzzy=True)
                break
            except Exception:
                continue
        if dt:
            # check conflicts
            with psycopg.connect(DB_DSN) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM appointments WHERE start_at = %s", (dt,))
                    conflict = cur.fetchone()
                    if conflict:
                        return ("That slot is already taken. Please propose another time.", {'booked': False})
                    cur.execute("INSERT INTO appointments (user_id, start_at, end_at, status, created_at) VALUES (%s, %s, %s, %s, now()) RETURNING id", (user_id, dt, dt + datetime.timedelta(minutes=30), 'confirmed'))
                    appt_id = cur.fetchone()[0]
                    return (f"Your appointment is confirmed for {dt.isoformat()}. Reference: {appt_id}", {'booked': True, 'id': appt_id})
    except Exception as e:
        print('booking error', e)
        return ("Sorry, I couldn't process that booking. Please provide a date and time in a clearer format.", {'booked': False})
    return ("I can help book appointments. What date and time would you like?", {'booked': False})
