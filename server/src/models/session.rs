use chrono::{DateTime, Duration, Utc};
use derive_more::Display;
use serde::Serialize;
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, FromRow, Display)]
#[display(
    "Session: {{ id: {}, refresh_token: {}, is_revoked: {}, expires_at: {}, created_at: {}, updated_at: {} }}",
    id,
    refresh_token,
    is_revoked,
    expires_at,
    created_at,
    updated_at
)]
#[serde(rename_all = "camelCase")]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub refresh_token: String,
    pub is_revoked: bool,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Session {
    pub fn new(user_id: Uuid, refresh_token: impl Into<String>, duration: Duration) -> Self {
        Self {
            id: Uuid::new_v4(),
            user_id,
            refresh_token: refresh_token.into(),
            is_revoked: false,
            expires_at: Utc::now() + duration,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    pub fn is_expired(&self) -> bool {
        self.expires_at < Utc::now()
    }
}
