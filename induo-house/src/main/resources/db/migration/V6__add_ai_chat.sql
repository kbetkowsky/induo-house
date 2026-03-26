CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chat_session (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL DEFAULT 'Nowa rozmowa',
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_message (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES chat_session(id) ON DELETE CASCADE,
    role        VARCHAR(10) NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
    content     TEXT NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_message_session ON chat_message(session_id, created_at);