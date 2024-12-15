-- Add down migration script here
DROP INDEX IF EXISTS users_email_index;
DROP INDEX IF EXISTS users_username_index;
DROP INDEX IF EXISTS users_github_id_index;
DROP TABLE IF EXISTS users;