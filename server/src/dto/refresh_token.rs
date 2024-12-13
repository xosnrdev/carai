use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RefreshTokenDto {
    #[allow(dead_code)]
    pub refresh_token: String,
}
