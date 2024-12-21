use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use super::UserResDto;

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub username: Option<String>,

    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub email: Option<String>,

    #[validate(length(min = 8, max = 128))]
    pub password: String,

    #[serde(default)]
    pub github_id: Option<i64>,

    #[validate(url)]
    #[serde(default)]
    pub avatar_url: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct LoginReqDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub username: Option<String>,

    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub email: Option<String>,

    #[validate(length(min = 8, max = 128))]
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginResDto {
    pub session_id: Uuid,
    pub access_token: String,
    pub refresh_token: String,
    pub access_token_expires_at: i64,
    pub refresh_token_expires_at: i64,
    pub user: UserResDto,
}
