CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  user_message TEXT,
  assistant_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_appointments_start_at ON appointments (start_at);
CREATE INDEX idx_appointments_user ON appointments (user_id);
CREATE INDEX idx_chat_user ON chat_sessions (user_id);

-- Sample data
INSERT INTO users (email, password_hash, name) VALUES ('alice@example.com', 'HASHED_PASSWORD_PLACEHOLDER', 'Alice');
INSERT INTO users (email, password_hash, name) VALUES ('bob@example.com', 'HASHED_PASSWORD_PLACEHOLDER', 'Bob');

INSERT INTO appointments (user_id, start_at, end_at, status) VALUES (1, '2025-10-21 09:00:00+00', '2025-10-21 09:30:00+00', 'confirmed');
