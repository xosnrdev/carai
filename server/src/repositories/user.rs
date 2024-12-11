use anyhow::anyhow;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{model::User, response::CaraiResult};

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

pub async fn read_user_by_github_id(pool: &PgPool, github_id: i64) -> CaraiResult<Option<User>> {
    sqlx::query_as!(
        User,
        r#"
        SELECT * FROM users
        WHERE github_id = $1
        "#,
        github_id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| anyhow!("Failed to read user by GitHub ID: {}", e))
}

pub async fn update_user_email(pool: &PgPool, id: Uuid, email: &str) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET email = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
        "#,
        email,
        Utc::now(),
        id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update user email: {}", e))
}

pub async fn update_user_password(
    pool: &PgPool,
    id: Uuid,
    password_hash: &str,
) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET password_hash = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
        "#,
        password_hash,
        Utc::now(),
        id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update user password: {}", e))
}

pub async fn update_user_profile(
    pool: &PgPool,
    id: Uuid,
    username: &str,
    avatar_url: Option<String>,
) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET username = $1, avatar_url = $2, updated_at = $3
        WHERE id = $4
        RETURNING *
        "#,
        username,
        avatar_url,
        Utc::now(),
        id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update user profile: {}", e))
}

pub async fn update_user_github_id(pool: &PgPool, id: Uuid, github_id: i64) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET github_id = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
        "#,
        github_id,
        Utc::now(),
        id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update user GitHub ID: {}", e))
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
