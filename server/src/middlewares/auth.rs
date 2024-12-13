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
use chrono::Utc;

use crate::{
    bootstrap::AppState,
    response::AppError,
    token::{Claims, Role, TokenManager},
};

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
            .map_err(|e| AppError::external(format!("{}", e), StatusCode::UNAUTHORIZED))?;

        let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());
        token_manager
            .validate_access_token(bearer.token(), Utc::now())
            .map_err(|e| AppError::external(format!("{}", e), StatusCode::UNAUTHORIZED))
    }
}

pub struct RefreshTokenClaims(pub Claims);

#[async_trait]
impl FromRequestParts<AppState> for RefreshTokenClaims {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let jar = PrivateCookieJar::from_request_parts(parts, state.key())
            .await
            .map_err(|e| AppError::external(format!("{}", e), StatusCode::UNAUTHORIZED))?;

        if let Some(token) = get_refresh_token(&jar) {
            let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());
            token_manager
                .validate_refresh_token(&token, Utc::now())
                .map_err(|e| AppError::external(format!("{}", e), StatusCode::UNAUTHORIZED))
                .map(RefreshTokenClaims)
        } else {
            Err(AppError::external(
                "Invalid token",
                StatusCode::UNAUTHORIZED,
            ))
        }
    }
}

fn get_refresh_token(jar: &PrivateCookieJar) -> Option<String> {
    jar.get("refresh_token")
        .map(|cookie| cookie.value().to_owned())
}

pub fn check_authorization(claims: &Claims, role: Role) -> Result<(), AppError> {
    if claims.role().contains(&role) {
        Ok(())
    } else {
        Err(AppError::external(
            "Unauthorized".to_string(),
            StatusCode::FORBIDDEN,
        ))
    }
}
