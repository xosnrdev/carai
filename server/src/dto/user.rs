use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateProfileDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(deserialize_with = "super::to_lowercase_optional")]
    pub username: Option<String>,
    #[validate(email, length(max = 320))]
    #[serde(deserialize_with = "super::to_lowercase_optional")]
    pub email: Option<String>,
    #[validate(length(min = 8, max = 128))]
    pub password: Option<String>,
    #[validate(url)]
    pub avatar_url: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(deserialize_with = "super::to_lowercase_optional")]
    pub username: Option<String>,

    #[validate(email, length(max = 320))]
    #[serde(deserialize_with = "super::to_lowercase_optional")]
    pub email: Option<String>,

    #[validate(length(min = 8, max = 128))]
    pub password: String,

    #[validate(range(min = 1))]
    pub github_id: Option<i64>,

    #[validate(url)]
    pub avatar_url: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginDto {
    #[serde(deserialize_with = "super::to_lowercase_optional")]
    #[validate(length(min = 3, max = 30))]
    pub username: Option<String>,

    #[serde(deserialize_with = "super::to_lowercase_optional")]
    pub email: Option<String>,

    #[validate(length(min = 8, max = 128))]
    pub password: String,
}
