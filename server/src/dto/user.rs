use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct UpdateEmailDto {
    #[validate(email, length(max = 320))]
    #[serde(deserialize_with = "super::to_lowercase")]
    pub email: String,
}

#[derive(Debug, Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePasswordDto {
    #[validate(length(min = 8, max = 128))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateUsernameDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(deserialize_with = "super::to_lowercase")]
    pub username: String,
}
