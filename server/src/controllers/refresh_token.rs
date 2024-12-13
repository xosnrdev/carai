use axum::extract::State;
use axum_extra::extract::PrivateCookieJar;
use chrono::{Duration, Utc};

use crate::{
    bootstrap::AppState,
    middlewares::auth::{check_authorization, RefreshTokenClaims},
    model::RefreshToken,
    repositories,
    response::{AppError, SuccessResponse},
    services::{create_refresh_token_cookie, handle_existing_token, TokenInfo},
    token::{Claims, Role, TokenManager},
};

pub async fn refresh_token_handler(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    claims: RefreshTokenClaims,
) -> Result<(PrivateCookieJar, SuccessResponse<TokenInfo>), AppError> {
    let now = Utc::now();
    let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());

    if let Ok((jar, response)) =
        handle_existing_token(&state, &token_manager, jar.to_owned(), *claims.0.sub(), now).await
    {
        return Ok((jar, response));
    }

    let refresh_expires_at =
        now + Duration::seconds(*state.config().jwt().refresh_token_expiration_in_secs());
    let new_refresh_token =
        token_manager.generate_refresh_token(*claims.0.sub(), refresh_expires_at, now)?;

    let refresh_token =
        RefreshToken::new(*claims.0.sub(), &new_refresh_token, refresh_expires_at, now);
    repositories::create_token(state.db_pool(), &refresh_token).await?;

    let access_expires_at =
        now + Duration::seconds(*state.config().jwt().access_token_expiration_in_secs());
    let access_token = token_manager.generate_access_token(
        *claims.0.sub(),
        access_expires_at,
        now,
        vec![Role::User],
    )?;

    let cookie = create_refresh_token_cookie(
        new_refresh_token.to_owned(),
        *state.config().jwt().refresh_token_expiration_in_secs(),
    );
    let jar = jar.add(cookie);

    let expires_in = token_manager.get_expires_in(&access_token)?;

    Ok((
        jar,
        SuccessResponse::ok(TokenInfo {
            access_token,
            refresh_token: new_refresh_token,
            token_type: "Bearer".to_string(),
            expires_in,
        }),
    ))
}

pub async fn revoke_refresh_token_handler(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    claims: Claims,
) -> Result<(PrivateCookieJar, SuccessResponse<()>), AppError> {
    check_authorization(&claims, Role::User)?;
    let jar = jar.remove("refresh_token");

    repositories::revoke_token(state.db_pool(), *claims.sub(), Utc::now()).await?;

    Ok((jar, SuccessResponse::no_content(())))
}
