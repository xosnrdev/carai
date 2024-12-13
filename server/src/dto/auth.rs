use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase_optional")]
    pub username: Option<String>,

    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase_optional")]
    pub email: Option<String>,

    #[validate(length(min = 8, max = 128))]
    pub password: String,

    #[serde(default)]
    pub github_id: Option<i64>,

    #[validate(url)]
    #[serde(default)]
    pub avatar_url: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase_optional")]
    pub username: Option<String>,

    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase_optional")]
    pub email: Option<String>,

    #[validate(length(min = 8, max = 128))]
    pub password: String,
}
