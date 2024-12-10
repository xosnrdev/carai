use chrono::{DateTime, Utc};
use derive_more::derive::Display;
use serde::Serialize;
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, FromRow, Display)]
#[display(
    "User: {{ id: {}, github_id: {:?}, username: {}, email: {}, avatar_url: {:?}, created_at: {}, updated_at: {} }}",
    id,
    github_id,
    username,
    email,
    avatar_url,
    created_at,
    updated_at
)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Uuid,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub github_id: Option<i64>,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar_url: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl User {
    pub fn new(
        email: String,
        password_hash: String,
        github_id: Option<i64>,
        username: String,
        avatar_url: Option<String>,
        now: DateTime<Utc>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            github_id,
            username,
            email: email.into(),
            password_hash: password_hash.into(),
            avatar_url,
            created_at: now,
            updated_at: now,
        }
    }
}
