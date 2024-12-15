use crate::{models::Session, utils::CaraiResult};
use anyhow::anyhow;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_session(pool: &PgPool, session: &Session) -> CaraiResult<Session> {
    sqlx::query_as!(
        Session,
        r#"
        INSERT INTO sessions (id, user_id, refresh_token, expires_at, is_revoked, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
        session.id,
        session.user_id,
        session.refresh_token,
        session.expires_at,
        session.is_revoked,
        session.created_at,
        session.updated_at
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Unable to create session ({})", e))
}

pub async fn get_session_by_user_id(pool: &PgPool, user_id: Uuid) -> CaraiResult<Option<Session>> {
    sqlx::query_as!(
        Session,
        r#"
        SELECT * FROM sessions
        WHERE user_id = $1
        "#,
        user_id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Unable to get session by ID ({})", e))
}

pub async fn revoke_session(pool: &PgPool, user_id: Uuid) -> CaraiResult<()> {
    sqlx::query!(
        r#"
        UPDATE sessions
        SET is_revoked = true, updated_at = $1
        WHERE user_id = $2
        "#,
        Utc::now(),
        user_id,
    )
    .execute(pool)
    .await
    .map_err(|e| anyhow!("Unable to revoke session ({})", e))?;
    Ok(())
}

pub async fn delete_session_by_user_id(pool: &PgPool, user_id: Uuid) -> CaraiResult<()> {
    sqlx::query!(
        r#"
        DELETE FROM sessions
        WHERE user_id = $1
        "#,
        user_id
    )
    .execute(pool)
    .await
    .map_err(|e| anyhow!("Unable to delete session ({})", e))?;
    Ok(())
}
