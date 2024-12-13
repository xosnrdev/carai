use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateProfileDto {
    #[validate(length(min = 3, max = 30))]
    #[serde(default, deserialize_with = "super::to_lowercase_optional")]
    pub username: Option<String>,
    #[validate(email, length(max = 320))]
    #[serde(default, deserialize_with = "super::to_lowercase_optional")]
    pub email: Option<String>,
    #[validate(length(min = 8, max = 128))]
    #[serde(default)]
    pub password: Option<String>,
    #[validate(url)]
    #[serde(default)]
    pub avatar_url: Option<String>,
}
