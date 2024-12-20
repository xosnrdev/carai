use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use axum_extra::extract::PrivateCookieJar;
use chrono::Duration;
use validator::Validate;

use crate::{
    bootstrap::AppState,
    dto::{process_optional_fields, LoginReqDto, LoginResDto},
    models::Session,
    repositories::{create_session, delete_session_by_user_id},
    services::{get_session_by_user_id, get_user_by_username_or_email},
    token::{Claims, TokenManager},
    utils::{check_password, AppError, SuccessResponse},
};

use super::create_cookie_session;

pub async fn login(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    Json(dto): Json<LoginReqDto>,
) -> Result<(PrivateCookieJar, SuccessResponse<LoginResDto>), AppError> {
    dto.validate()
        .map_err(|e| AppError::new(StatusCode::UNPROCESSABLE_ENTITY, format!("{}", e)))?;

    let (username, email) = process_optional_fields(dto.username, dto.email)?;

    let user = get_user_by_username_or_email(state.db_pool(), &username, &email)
        .await?
        .ok_or_else(|| AppError::new(StatusCode::UNAUTHORIZED, "Invalid credentials"))?;

    if !check_password(&dto.password, &user.password_hash)? {
        return Err(AppError::new(
            StatusCode::UNAUTHORIZED,
            "Invalid credentials",
        ));
    }

    let token_manager = TokenManager::new(state.config().jwt().secret().as_bytes(), None);

    if let Some(session) = get_session_by_user_id(state.db_pool(), user.id).await? {
        // Check for stale sessions
        // Enforce the policy of a single active session per user, ensuring it is not expired or revoked
        // Prevent the accumulation of stale sessions in the database
        // This approach might be revised in the future if requirements change
        if session.is_expired() || session.is_revoked {
            delete_session_by_user_id(state.db_pool(), session.user_id).await?;
        } else {
            let duration = Duration::seconds(*state.config().jwt().access_token_expiration_secs());
            let (access_token, access_claims) = token_manager.create_access_token(
                session.user_id,
                &user.email,
                user.is_admin,
                duration,
            )?;

            let jar = jar.add(create_cookie_session(
                &session.refresh_token,
                session.expires_at.timestamp(),
            ));

            let access_token_expires_at = *access_claims.exp() - *access_claims.iat();
            let refresh_token_expires_at =
                session.expires_at.timestamp() - session.created_at.timestamp();

            return Ok((
                jar,
                SuccessResponse::created(LoginResDto {
                    session_id: session.id,
                    access_token,
                    refresh_token: session.refresh_token,
                    access_token_expires_at,
                    refresh_token_expires_at,
                    user: user.into(),
                }),
            ));
        }
    }

    let refresh_exp_secs = *state.config().jwt().refresh_token_expiration_secs();
    let access_exp_secs = *state.config().jwt().access_token_expiration_secs();
    let refresh_duration = Duration::seconds(refresh_exp_secs);
    let access_duration = Duration::seconds(access_exp_secs);

    let (refresh_token, refresh_claims) = token_manager.create_refresh_token(
        user.id,
        &user.email,
        user.is_admin,
        refresh_duration,
    )?;

    let (access_token, access_claims) =
        token_manager.create_access_token(user.id, &user.email, user.is_admin, access_duration)?;

    let session = Session::new(user.id, &refresh_token, Duration::seconds(refresh_exp_secs));

    // Store the session in the database
    create_session(state.db_pool(), &session).await?;

    // Add the refresh token to the cookie jar
    let jar = jar.add(create_cookie_session(&refresh_token, *refresh_claims.exp()));

    let access_token_expires_at = *access_claims.exp() - *access_claims.iat();
    let refresh_token_expires_at = *refresh_claims.exp() - *refresh_claims.iat();

    let body = LoginResDto {
        session_id: session.id,
        access_token,
        refresh_token,
        access_token_expires_at,
        refresh_token_expires_at,
        user: user.into(),
    };

    Ok((jar, SuccessResponse::created(body)))
}

pub async fn logout(
    State(state): State<AppState>,
    claims: Claims,
    jar: PrivateCookieJar,
) -> Result<impl IntoResponse, AppError> {
    delete_session_by_user_id(state.db_pool(), *claims.jti()).await?;

    let cookie = create_cookie_session("", 0);
    let jar = jar.add(cookie);

    Ok((jar, StatusCode::NO_CONTENT))
}
