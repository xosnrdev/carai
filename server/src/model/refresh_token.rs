use chrono::{DateTime, Utc};
use derive_more::Display;
use getset::Getters;
use serde::Serialize;
use smart_default::SmartDefault;
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, FromRow, SmartDefault, Getters, Display)]
#[display(
    "RefreshToken: {{ id: {}, user_id: {}, created_at: {} expires_at: {}, is_revoked: {} }}",
    id,
    user_id,
    created_at,
    expires_at,
    is_revoked
)]
#[serde(rename_all = "camelCase")]
pub struct RefreshToken {
    pub id: Uuid,
    pub user_id: Uuid,
    #[serde(skip_serializing)]
    pub token: String,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    #[getset(get = "pub")]
    #[default = false]
    pub is_revoked: bool,
}

impl RefreshToken {
    pub fn new(
        user_id: Uuid,
        token: String,
        expires_at: DateTime<Utc>,
        now: DateTime<Utc>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            user_id,
            token,
            expires_at,
            created_at: now,
            updated_at: now,
            ..Default::default()
        }
    }

    pub fn is_expired(&self, now: DateTime<Utc>) -> bool {
        now > self.expires_at
    }

    pub const fn read_user_id(&self) -> Uuid {
        self.user_id
    }
}
