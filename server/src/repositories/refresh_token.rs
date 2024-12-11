use crate::{model::RefreshToken, response::CaraiResult};
use anyhow::anyhow;
use chrono::{DateTime, Utc};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn create_token(pool: &PgPool, token: &RefreshToken) -> CaraiResult<RefreshToken> {
    sqlx::query_as!(
        RefreshToken,
        r#"
        INSERT INTO refresh_tokens (id, user_id, token, expires_at, is_revoked, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
        token.id,
        token.user_id,
        token.token,
        token.expires_at,
        token.is_revoked,
        token.created_at,
        token.updated_at
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to create refresh token: {}", e))
}

pub async fn read_token_by_user(pool: &PgPool, user_id: Uuid) -> CaraiResult<Option<RefreshToken>> {
    sqlx::query_as!(
        RefreshToken,
        r#"
        SELECT * FROM refresh_tokens
        WHERE user_id = $1
        "#,
        user_id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read refresh token by user: {}", e))
}

pub async fn read_token_by_value(pool: &PgPool, token: &str) -> CaraiResult<Option<RefreshToken>> {
    sqlx::query_as!(
        RefreshToken,
        r#"
        SELECT * FROM refresh_tokens
        WHERE token = $1
        "#,
        token
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read refresh token by value: {}", e))
}

pub async fn revoke_token(pool: &PgPool, user_id: Uuid, now: DateTime<Utc>) -> CaraiResult<()> {
    sqlx::query!(
        r#"
        UPDATE refresh_tokens
        SET is_revoked = true, updated_at = $1
        WHERE user_id = $2
        "#,
        now,
        user_id
    )
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn delete_token(pool: &PgPool, user_id: Uuid) -> CaraiResult<()> {
    sqlx::query!(
        r#"
        DELETE FROM refresh_tokens
        WHERE user_id = $1
        "#,
        user_id
    )
    .execute(pool)
    .await?;
    Ok(())
}
