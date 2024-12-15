-- Add up migration script here
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    is_revoked BOOLEAN NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_refresh_token_index ON sessions(refresh_token);
CREATE INDEX IF NOT EXISTS sessions_user_id_index ON sessions(user_id);