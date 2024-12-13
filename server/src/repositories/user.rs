use anyhow::anyhow;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{models::User, response::CaraiResult};

pub async fn create_user(pool: &PgPool, user: &User) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (
            id, github_id, username, email, 
            password_hash, avatar_url, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        "#,
        user.id,
        user.github_id,
        user.username,
        user.email,
        user.password_hash,
        user.avatar_url,
        user.created_at,
        user.updated_at
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to create user: {}", e))
}

pub async fn read_user_by_id(pool: &PgPool, id: Uuid) -> CaraiResult<Option<User>> {
    sqlx::query_as!(
        User,
        r#"
        SELECT * FROM users
        WHERE id = $1
        "#,
        id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read user by id: {}", e))
}

pub async fn read_user_by_email(pool: &PgPool, email: &str) -> CaraiResult<Option<User>> {
    sqlx::query_as!(
        User,
        r#"
        SELECT * FROM users
        WHERE email = $1
        "#,
        email
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read user by email: {}", e))
}

pub async fn read_user_by_username(pool: &PgPool, username: &str) -> CaraiResult<Option<User>> {
    sqlx::query_as!(
        User,
        r#"
        SELECT * FROM users
        WHERE username = $1
        "#,
        username
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read user by username: {}", e))
}

pub async fn read_user_by_username_or_email(
    pool: &PgPool,
    username: &str,
    email: &str,
) -> CaraiResult<Option<User>> {
    sqlx::query_as!(
        User,
        r#"
        SELECT * FROM users
        WHERE username = $1 OR email = $2
        "#,
        username,
        email
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read user by username or email: {}", e))
}

pub async fn read_all_users(pool: &PgPool, limit: i64, offset: i64) -> CaraiResult<Vec<User>> {
    sqlx::query_as!(
        User,
        r#"
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        "#,
        limit,
        offset
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to read all users: {}", e))
}

pub async fn update_user_profile(
    pool: &PgPool,
    id: Uuid,
    username: &str,
    email: &str,
    password_hash: &str,
    avatar_url: Option<String>,
) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET username = $1, email = $2, password_hash = $3, avatar_url = $4, updated_at = $5
        WHERE id = $6
        RETURNING *
        "#,
        username,
        email,
        password_hash,
        avatar_url,
        Utc::now(),
        id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update user profile: {}", e))
}

pub async fn delete_user(pool: &PgPool, id: Uuid) -> CaraiResult<()> {
    sqlx::query!(
        r#"
        DELETE FROM users
        WHERE id = $1
        "#,
        id
    )
    .execute(pool)
    .await?;
    Ok(())
}
