#![deny(missing_docs)]
//! This module provides middleware extractors for handling JWT authorization,
//! ensuring requests contain valid access or refresh tokens where needed.

use crate::{
    bootstrap::AppState,
    token::{Claims, TokenManager},
    utils::AppError,
};
use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
    RequestPartsExt,
};
use axum_extra::{
    extract::PrivateCookieJar,
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};

/// Middleware extractor that validates the `Authorization: Bearer` header for access tokens.
///
/// If the token is invalid or missing, it returns an `AppError` with a `UNAUTHORIZED` status.
#[async_trait]
impl FromRequestParts<AppState> for Claims {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|e| AppError::new(StatusCode::UNAUTHORIZED, format!("{}", e)))?;

        // Configure the TokenManager
        let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes(), None);

        token_manager
            .validate_access_token(bearer.token())
            .map_err(|e| AppError::new(StatusCode::UNAUTHORIZED, format!("{}", e)))
    }
}

/// A wrapper type to signal that the contained `Claims` come from a refresh token.
pub struct RefreshClaims(pub Claims);

/// Middleware extractor that validates the presence and validity of a refresh token stored in cookies.
///
/// If the refresh token is invalid, missing, or expired, returns an `AppError` with `UNAUTHORIZED`.
#[async_trait]
impl FromRequestParts<AppState> for RefreshClaims {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let jar = PrivateCookieJar::from_request_parts(parts, state.key())
            .await
            .map_err(|e| AppError::new(StatusCode::UNAUTHORIZED, format!("{}", e)))?;

        if let Some(token) = get_session_token(&jar) {
            let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes(), None);

            token_manager
                .validate_refresh_token(&token)
                .map(RefreshClaims)
                .map_err(|e| AppError::new(StatusCode::UNAUTHORIZED, format!("{}", e)))
        } else {
            Err(AppError::new(
                StatusCode::UNAUTHORIZED,
                "Missing refresh token",
            ))
        }
    }
}

/// Extracts the `refresh_token` from the user's cookie jar.
///
/// Returns `Some(token)` if present, otherwise `None`.
fn get_session_token(jar: &PrivateCookieJar) -> Option<String> {
    jar.get("refresh_token")
        .map(|cookie| cookie.value().to_owned())
}

/// Checks if the user has admin privileges.
pub fn check_admin(claims: &Claims) -> Result<(), AppError> {
    if !claims.is_admin() {
        Err(AppError::new(
            StatusCode::FORBIDDEN,
            "Access denied: admin privileges required",
        ))
    } else {
        Ok(())
    }
}
