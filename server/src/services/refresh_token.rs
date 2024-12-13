use axum::http::StatusCode;
use axum_extra::extract::{
    cookie::{Cookie, SameSite},
    PrivateCookieJar,
};
use chrono::{DateTime, Duration, Utc};
use serde::Serialize;
use uuid::Uuid;

use crate::{
    bootstrap::AppState,
    repositories,
    response::{AppError, SuccessResponse},
    token::{Role, TokenManager},
};

pub fn generate_tokens(
    token_manager: &TokenManager,
    user_id: Uuid,
    access_expires_at: DateTime<Utc>,
    refresh_expires_at: DateTime<Utc>,
    now: DateTime<Utc>,
) -> Result<(String, String), AppError> {
    let access_token =
        token_manager.generate_access_token(user_id, access_expires_at, now, vec![Role::User])?;
    let refresh_token = token_manager.generate_refresh_token(user_id, refresh_expires_at, now)?;
    Ok((access_token, refresh_token))
}

pub fn create_refresh_token_cookie(refresh_token: String, expiration_secs: i64) -> Cookie<'static> {
    let max_age = time::Duration::seconds(expiration_secs);
    Cookie::build(("refresh_token", refresh_token))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(max_age)
        .expires(time::OffsetDateTime::now_utc() + max_age)
        .build()
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenInfo {
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
}

pub async fn handle_existing_token(
    state: &AppState,
    token_manager: &TokenManager<'_>,
    jar: PrivateCookieJar,
    user_id: Uuid,
    now: DateTime<Utc>,
) -> Result<(PrivateCookieJar, SuccessResponse<TokenInfo>), AppError> {
    if let Some(old_token) = repositories::read_token_by_user(state.db_pool(), user_id).await? {
        if *old_token.is_revoked() || old_token.is_expired(now) {
            let _ = jar.remove("refresh_token");
            repositories::delete_token(state.db_pool(), old_token.id).await?;
        } else {
            let expires_at =
                now + Duration::seconds(*state.config().jwt().access_token_expiration_in_secs());
            let access_token = token_manager.generate_access_token(
                old_token.user_id,
                expires_at,
                now,
                vec![Role::User],
            )?;

            let expires_in = token_manager.get_expires_in(&access_token)?;

            return Ok((
                jar,
                SuccessResponse::created(TokenInfo {
                    access_token,
                    refresh_token: old_token.token,
                    token_type: "Bearer".to_string(),
                    expires_in,
                }),
            ));
        }
    }

    Err(AppError::external("Token not found", StatusCode::NOT_FOUND))
}
