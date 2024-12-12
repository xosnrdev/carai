use axum::{async_trait, extract::FromRequestParts, http::request::Parts, RequestPartsExt};
use axum_extra::{
    extract::CookieJar,
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use chrono::Utc;

use crate::{
    bootstrap::AppState,
    response::AppError,
    token::{Claims, Role, TokenManager},
};

pub fn is_authorized(claims: &Claims, role: Role) -> bool {
    claims.role().contains(&role)
}

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
            .map_err(|e| AppError::external(format!("{}", e), 401))?;

        let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());
        token_manager
            .validate_access_token(bearer.token(), Utc::now())
            .map_err(|e| AppError::external(format!("{}", e), 401))
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
        let jar = parts
            .extract::<CookieJar>()
            .await
            .map_err(|e| AppError::external(format!("{}", e), 401))?;

        if let Some(token) = get_refresh_token(&jar) {
            let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());
            token_manager
                .validate_refresh_token(&token, Utc::now())
                .map_err(|e| AppError::external(format!("{}", e), 401))
                .map(RefreshTokenClaims)
        } else {
            Err(AppError::external("Missing refresh token", 401))
        }
    }
}

fn get_refresh_token(jar: &CookieJar) -> Option<String> {
    jar.get("refresh_token")
        .map(|cookie| cookie.value().to_owned())
}
