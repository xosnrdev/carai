use crate::{model::RefreshToken, response::CaraiResult};
use anyhow::anyhow;
use chrono::Utc;
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

pub async fn read_token_by_value(
    pool: &PgPool,
    token_value: &str,
) -> CaraiResult<Option<RefreshToken>> {
    sqlx::query_as!(
        RefreshToken,
        r#"
        SELECT * FROM refresh_tokens
        WHERE token = $1
        "#,
        token_value
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read refresh token by value: {}", e))
}

pub async fn update_token(pool: &PgPool, user_id: Uuid) -> CaraiResult<RefreshToken> {
    sqlx::query_as!(
        RefreshToken,
        r#"
        UPDATE refresh_tokens
        SET is_revoked = true, updated_at = $1
        WHERE user_id = $2
        RETURNING *
        "#,
        Utc::now(),
        user_id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update refresh token: {}", e))
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
