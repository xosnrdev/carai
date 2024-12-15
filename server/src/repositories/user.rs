use anyhow::anyhow;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{models::User, utils::CaraiResult};

pub async fn create_user(pool: &PgPool, user: &User) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (
            id, github_id, username, email, 
            password_hash, avatar_url, is_admin, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        "#,
        user.id,
        user.github_id,
        user.username,
        user.email,
        user.password_hash,
        user.avatar_url,
        user.is_admin,
        user.created_at,
        user.updated_at
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Unable to create user ({})", e))
}

pub async fn get_user_by_id(pool: &PgPool, id: Uuid) -> CaraiResult<Option<User>> {
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
    .map_err(|e| anyhow!("Unable to get user by id ({})", e))
}

pub async fn get_user_by_github_id(pool: &PgPool, github_id: i64) -> CaraiResult<Option<User>> {
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
    .map_err(|e| anyhow!("Unable to get user by GitHub ID ({})", e))
}

pub async fn get_user_by_email(pool: &PgPool, email: &str) -> CaraiResult<Option<User>> {
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
    .map_err(|e| anyhow!("Unable to get user by email ({})", e))
}

pub async fn get_user_by_username(pool: &PgPool, username: &str) -> CaraiResult<Option<User>> {
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
    .map_err(|e| anyhow!("Unable to get user by username ({})", e))
}

pub async fn get_user_by_username_or_email(
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
    .map_err(|e| anyhow!("Unable to get user by username or email ({})", e))
}

pub async fn get_all_users(pool: &PgPool, limit: i64, offset: i64) -> CaraiResult<Vec<User>> {
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
    .map_err(|e| anyhow!("Unable to get all users ({})", e))
}

pub async fn update_user(pool: &PgPool, user: &User) -> CaraiResult<User> {
    sqlx::query_as!(
        User,
        r#"
        UPDATE users
        SET username = $2, email = $3, avatar_url = $4, is_admin = $5,updated_at = $6
        WHERE id = $1
        RETURNING *
        "#,
        user.id,
        user.username,
        user.email,
        user.avatar_url,
        user.is_admin,
        Utc::now()
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Unable to update user ({})", e))
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
    .await
    .map_err(|e| anyhow!("Unable to delete user ({})", e))?;
    Ok(())
}
