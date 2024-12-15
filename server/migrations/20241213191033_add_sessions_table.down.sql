-- Add down migration script here
DROP INDEX IF EXISTS sessions_refresh_token_index;
DROP INDEX IF EXISTS sessions_user_id_index;
DROP TABLE IF EXISTS sessions;