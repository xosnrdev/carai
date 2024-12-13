use axum::{extract::State, http::StatusCode, Json};
use axum_extra::extract::PrivateCookieJar;

use crate::{
    bootstrap::AppState,
    dto::UpdateProfileDto,
    middlewares::auth::check_authorization,
    models::User,
    password::hash_password,
    repositories,
    response::{AppError, SuccessResponse},
    services::{fetch_user_by_id, validate_dto},
    token::{Claims, Role},
};

pub async fn get_me_handler(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<SuccessResponse<User>, AppError> {
    check_authorization(&claims, Role::User)?;
    let user = fetch_user_by_id(&state, *claims.sub()).await?;
    Ok(SuccessResponse::ok(user))
}

pub async fn update_me_handler(
    State(state): State<AppState>,
    claims: Claims,
    Json(dto): Json<UpdateProfileDto>,
) -> Result<SuccessResponse<User>, AppError> {
    validate_dto(&dto)?;
    check_authorization(&claims, Role::User)?;

    let mut user = fetch_user_by_id(&state, *claims.sub()).await?;

    if let Some(username) = dto.username {
        if repositories::read_user_by_username(state.db_pool(), &username)
            .await?
            .is_some()
        {
            return Err(AppError::external(
                "Username already exists",
                StatusCode::CONFLICT,
            ));
        }
        user.username = username;
    }

    if let Some(email) = dto.email {
        if repositories::read_user_by_email(state.db_pool(), &email)
            .await?
            .is_some()
        {
            return Err(AppError::external(
                "Email already exists",
                StatusCode::CONFLICT,
            ));
        }
        user.email = email;
    }

    if let Some(password) = dto.password {
        user.password_hash = hash_password(password.as_bytes())?;
    }

    user.avatar_url = dto.avatar_url;

    let updated_user = repositories::update_user_profile(
        state.db_pool(),
        *claims.sub(),
        &user.username,
        &user.email,
        &user.password_hash,
        user.avatar_url,
    )
    .await?;

    Ok(SuccessResponse::ok(updated_user))
}

pub async fn delete_me_handler(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    claims: Claims,
) -> Result<(PrivateCookieJar, SuccessResponse<()>), AppError> {
    check_authorization(&claims, Role::User)?;
    repositories::delete_user(state.db_pool(), *claims.sub()).await?;
    let jar = jar.remove("refresh_token");

    Ok((jar, SuccessResponse::no_content(())))
}

pub async fn logout_handler(
    State(state): State<AppState>,
    jar: PrivateCookieJar,
    claims: Claims,
) -> Result<(PrivateCookieJar, SuccessResponse<()>), AppError> {
    check_authorization(&claims, Role::User)?;
    let jar = jar.remove("refresh_token");
    repositories::delete_token(state.db_pool(), *claims.sub()).await?;

    Ok((jar, SuccessResponse::no_content(())))
}
