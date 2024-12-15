use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct AccessTokenReqDto {
    pub refresh_token: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccessTokenResDto {
    pub access_token: String,
    pub access_token_expires_at: i64,
}
