use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::models::User;

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UserReqDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub username: Option<String>,
    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub email: Option<String>,
    #[validate(length(min = 8, max = 128))]
    #[serde(default)]
    pub password: String,
    #[validate(url)]
    #[serde(default)]
    pub avatar_url: Option<String>,
    #[serde(default)]
    pub github_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct UserResDto {
    pub username: String,
    pub email: String,
    pub is_admin: bool,
    pub avatar_url: Option<String>,
    pub github_id: Option<i64>,
}

impl From<User> for UserResDto {
    fn from(user: User) -> Self {
        UserResDto {
            username: user.username,
            email: user.email,
            is_admin: user.is_admin,
            avatar_url: user.avatar_url,
            github_id: user.github_id,
        }
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct PatchReqDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub username: Option<String>,
    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase")]
    pub email: Option<String>,
    #[validate(length(min = 8, max = 128))]
    #[serde(default)]
    pub password: Option<String>,
    #[validate(url)]
    #[serde(default)]
    pub avatar_url: Option<String>,
    #[serde(default)]
    pub github_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct GetAllUsersQueryDto {
    #[serde(default)]
    pub limit: Option<i64>,
    #[serde(default)]
    pub offset: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct GetAllUsersResDto {
    pub users: Vec<UserResDto>,
}

impl From<Vec<User>> for GetAllUsersResDto {
    fn from(users: Vec<User>) -> Self {
        Self {
            users: users.into_iter().map(UserResDto::from).collect(),
        }
    }
}
