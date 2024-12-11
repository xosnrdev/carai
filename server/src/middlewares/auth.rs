use axum::{async_trait, extract::FromRequestParts, http::request::Parts, RequestPartsExt};
use axum_extra::{
    headers::{authorization::Bearer, Authorization},
    TypedHeader,
};
use chrono::Utc;

use crate::{
    bootstrap::AppState,
    response::AppError,
    token::{Claims, Role, Scope, TokenManager},
};

pub fn is_authorized(claims: &Claims, role: Role, scope: Scope) -> bool {
    claims.role().contains(&role) && claims.scope().contains(&scope)
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
            .map_err(|e| {
                AppError::external(
                    format!("Failed to extract authorization header: {}", e),
                    401,
                )
            })?;

        let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());
        token_manager
            .validate_access_token(bearer.token(), Utc::now())
            .map_err(|e| AppError::external(format!("Failed to validate access token: {}", e), 401))
    }
}
