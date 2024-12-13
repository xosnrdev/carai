use axum::{extract::State, http::StatusCode, Json};
use axum_extra::extract::PrivateCookieJar;
use chrono::{Duration, Utc};

use crate::{
    bootstrap::AppState,
    dto::{LoginDto, RegisterDto},
    model::User,
    password::{hash_password, verify_password},
    repositories,
    response::{AppError, SuccessResponse},
    services::{
        create_refresh_token_cookie, generate_tokens, handle_existing_token, validate_dto,
        TokenInfo,
    },
    token::TokenManager,
};

pub async fn login_handler(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    Json(dto): Json<LoginDto>,
) -> Result<(PrivateCookieJar, SuccessResponse<TokenInfo>), AppError> {
    validate_dto(&dto)?;

    if dto.username.is_none() && dto.email.is_none() {
        return Err(AppError::external(
            "Missing `username` or `email`",
            StatusCode::UNPROCESSABLE_ENTITY,
        ));
    }

    let username = dto.username.as_deref().unwrap_or_default();
    let email = dto.email.as_deref().unwrap_or_default();

    let user = repositories::read_user_by_username_or_email(state.db_pool(), username, email)
        .await?
        .ok_or_else(|| AppError::external("Invalid credentials", StatusCode::UNAUTHORIZED))?;

    if !verify_password(dto.password.as_bytes(), &user.password_hash)? {
        return Err(AppError::external(
            "Invalid credentials",
            StatusCode::UNAUTHORIZED,
        ));
    }

    let now = Utc::now();
    let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes());
    let access_token_expires_at =
        now + Duration::seconds(*state.config().jwt().access_token_expiration_in_secs());
    let refresh_token_expires_at =
        now + Duration::seconds(*state.config().jwt().refresh_token_expiration_in_secs());

    if let Ok((jar, response)) =
        handle_existing_token(&state, &token_manager, jar.to_owned(), user.id, now).await
    {
        return Ok((jar, response));
    }

    let (access_token, new_refresh_token) = generate_tokens(
        &token_manager,
        user.id,
        access_token_expires_at,
        refresh_token_expires_at,
        now,
    )?;

    let cookie = create_refresh_token_cookie(
        new_refresh_token.to_owned(),
        *state.config().jwt().refresh_token_expiration_in_secs(),
    );

    let jar = jar.add(cookie);

    let expires_in = token_manager.get_expires_in(&access_token)?;

    Ok((
        jar,
        SuccessResponse::created(TokenInfo {
            access_token,
            refresh_token: new_refresh_token,
            token_type: "Bearer".to_string(),
            expires_in,
        }),
    ))
}

pub async fn register_handler(
    State(state): State<AppState>,
    Json(dto): Json<RegisterDto>,
) -> Result<SuccessResponse<User>, AppError> {
    validate_dto(&dto)?;

    let username = dto.username.as_deref().unwrap_or_default();
    let email = dto.email.as_deref().unwrap_or_default();

    if repositories::read_user_by_username_or_email(state.db_pool(), username, email)
        .await?
        .is_some()
    {
        return Err(AppError::external(
            "User already exists",
            StatusCode::CONFLICT,
        ));
    }

    let password_hash = hash_password(dto.password.as_bytes())?;

    let user = User::new(
        email,
        password_hash,
        dto.github_id,
        username,
        dto.avatar_url,
        Utc::now(),
    );

    let created_user = repositories::create_user(state.db_pool(), &user).await?;

    Ok(SuccessResponse::created(created_user))
}
