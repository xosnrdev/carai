use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(deserialize_with = "super::to_lowercase")]
    pub username: String,

    #[validate(email, length(max = 320))]
    #[serde(deserialize_with = "super::to_lowercase")]
    pub email: String,

    #[validate(length(min = 8, max = 128))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginDto {
    #[validate(length(max = 320))]
    #[serde(deserialize_with = "super::to_lowercase")]
    pub email: String,

    #[validate(length(min = 8, max = 128))]
    pub password: String,
}
