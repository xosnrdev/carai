use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::PrivateCookieJar;
use chrono::Duration;
use uuid::Uuid;

use crate::{
    bootstrap::AppState,
    dto::{AccessTokenReqDto, AccessTokenResDto},
    middlewares::auth::{check_admin, RefreshClaims},
    services::{delete_session_by_user_id, get_session_by_user_id, revoke_session},
    token::{Claims, TokenManager},
    utils::{AppError, SuccessResponse},
};

use super::create_cookie_session;

pub async fn refresh_session_by_cookie(
    State(state): State<AppState>,
    claims: RefreshClaims,
) -> Result<SuccessResponse<AccessTokenResDto>, AppError> {
    let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes(), None);

    handle_stale_sessions(
        &state,
        *claims.0.jti(),
        *claims.0.is_admin(),
        claims.0.sub(),
        token_manager,
    )
    .await
}

pub async fn refresh_session_by_body(
    State(state): State<AppState>,
    Json(dto): Json<AccessTokenReqDto>,
) -> Result<SuccessResponse<AccessTokenResDto>, AppError> {
    let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes(), None);

    let token = token_manager.validate_refresh_token(&dto.refresh_token)?;

    handle_stale_sessions(
        &state,
        *token.jti(),
        *token.is_admin(),
        token.sub(),
        token_manager,
    )
    .await
}

pub async fn revoke_my_session(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    claims: Claims,
) -> Result<impl IntoResponse, AppError> {
    revoke_session(state.db_pool(), *claims.jti()).await?;

    let cookie = create_cookie_session("", 0);
    let jar = jar.add(cookie);

    Ok((jar, StatusCode::NO_CONTENT))
}

pub async fn revoke_user_session(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
    claims: Claims,
) -> Result<impl IntoResponse, AppError> {
    check_admin(&claims)?;

    revoke_session(state.db_pool(), user_id).await?;
    Ok(StatusCode::NO_CONTENT)
}

pub async fn revoke_all_sessions(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<impl IntoResponse, AppError> {
    check_admin(&claims)?;

    revoke_session(state.db_pool(), Uuid::nil()).await?;
    Ok(StatusCode::NO_CONTENT)
}

async fn handle_stale_sessions(
    state: &AppState,
    user_id: Uuid,
    is_admin: bool,
    sub: &str,
    token_manager: TokenManager<'_>,
) -> Result<SuccessResponse<AccessTokenResDto>, AppError> {
    if let Some(session) = get_session_by_user_id(state.db_pool(), user_id).await? {
        if session.is_expired() || session.is_revoked {
            delete_session_by_user_id(state.db_pool(), session.user_id).await?;
            return Err(AppError::new(StatusCode::UNAUTHORIZED, "Invalid token"));
        } else {
            let duration = Duration::seconds(*state.config().jwt().access_token_expiration_secs());
            let (access_token, access_claims) =
                token_manager.create_access_token(session.user_id, sub, is_admin, duration)?;

            return Ok(SuccessResponse::created(AccessTokenResDto {
                access_token,
                access_token_expires_at: *access_claims.exp(),
            }));
        }
    }

    Err(AppError::new(StatusCode::UNAUTHORIZED, "Invalid token"))
}
