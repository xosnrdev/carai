use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use uuid::Uuid;
use validator::Validate;

use crate::{
    bootstrap::AppState,
    dto::{
        process_optional_fields, GetAllUsersQueryDto, GetAllUsersResDto, PatchReqDto, UserReqDto,
        UserResDto,
    },
    middlewares::auth::check_admin,
    models::User,
    services::{
        self, get_user_by_email, get_user_by_github_id, get_user_by_id, get_user_by_username,
        get_user_by_username_or_email,
    },
    token::Claims,
    utils::{hash_password, AppError, SuccessResponse},
};

pub async fn register(
    State(state): State<AppState>,
    Json(dto): Json<UserReqDto>,
) -> Result<SuccessResponse<UserResDto>, AppError> {
    dto.validate()
        .map_err(|e| AppError::new(StatusCode::UNPROCESSABLE_ENTITY, format!("{}", e)))?;

    let (username, email) = process_optional_fields(dto.username, dto.email)?;

    if get_user_by_username_or_email(state.db_pool(), &username, &email)
        .await?
        .is_some()
    {
        return Err(AppError::new(StatusCode::CONFLICT, "User already exists"));
    }

    let password_hash = hash_password(&dto.password)?;

    let new_user = User::new(
        dto.github_id,
        email,
        password_hash,
        username,
        dto.avatar_url,
    );
    tracing::info!("Creating new user: {}", new_user);
    let user = services::create_user(state.db_pool(), &new_user).await?;
    Ok(SuccessResponse::created(UserResDto::from(user)))
}

pub async fn get_all_users(
    State(state): State<AppState>,
    claims: Claims,
    Query(query): Query<GetAllUsersQueryDto>,
) -> Result<SuccessResponse<GetAllUsersResDto>, AppError> {
    check_admin(&claims)?;

    let limit = query.limit.unwrap_or(50);
    let offset = query.offset.unwrap_or(0);

    // Limit the number of users to fetch to 100 for now.
    let limit = limit.min(100);

    let users = services::get_all_users(state.db_pool(), limit, offset).await?;
    Ok(SuccessResponse::ok(GetAllUsersResDto::from(users)))
}

pub async fn update_me(
    State(state): State<AppState>,
    claims: Claims,
    Json(dto): Json<PatchReqDto>,
) -> Result<SuccessResponse<UserResDto>, AppError> {
    handle_patch_updates(&state, dto, *claims.jti()).await
}

pub async fn update_user(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    claims: Claims,
    Json(dto): Json<PatchReqDto>,
) -> Result<SuccessResponse<UserResDto>, AppError> {
    check_admin(&claims)?;

    handle_patch_updates(&state, dto, id).await
}

pub async fn delete_user(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    claims: Claims,
) -> Result<impl IntoResponse, AppError> {
    check_admin(&claims)?;

    services::delete_user(state.db_pool(), id).await?;
    tracing::info!("Deleted user with ID: {}", id);
    Ok(StatusCode::NO_CONTENT)
}

pub async fn delete_me(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<impl IntoResponse, AppError> {
    services::delete_user(state.db_pool(), *claims.jti()).await?;
    tracing::info!("Deleted user with ID: {}", claims.jti());
    Ok(StatusCode::NO_CONTENT)
}

pub async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    claims: Claims,
) -> Result<SuccessResponse<UserResDto>, AppError> {
    check_admin(&claims)?;
    let user = get_user_by_id(state.db_pool(), id)
        .await?
        .ok_or_else(|| AppError::new(StatusCode::NOT_FOUND, "User not found"))?;
    Ok(SuccessResponse::ok(UserResDto::from(user)))
}

pub async fn get_me(
    State(state): State<AppState>,
    claims: Claims,
) -> Result<SuccessResponse<UserResDto>, AppError> {
    let user = get_user_by_id(state.db_pool(), *claims.jti())
        .await?
        .ok_or_else(|| AppError::new(StatusCode::NOT_FOUND, "User not found"))?;
    Ok(SuccessResponse::ok(UserResDto::from(user)))
}

async fn handle_patch_updates(
    state: &AppState,
    dto: PatchReqDto,
    user_id: Uuid,
) -> Result<SuccessResponse<UserResDto>, AppError> {
    dto.validate()
        .map_err(|e| AppError::new(StatusCode::UNPROCESSABLE_ENTITY, format!("{}", e)))?;

    let mut user = get_user_by_id(state.db_pool(), user_id)
        .await?
        .ok_or_else(|| AppError::new(StatusCode::NOT_FOUND, "User not found"))?;

    if dto.username.is_some() {
        let username = dto.username.unwrap_or_default();
        if get_user_by_username(state.db_pool(), &username)
            .await?
            .is_some()
        {
            return Err(AppError::new(
                StatusCode::CONFLICT,
                "Username already exists",
            ));
        }
        user.username = username;
    }

    if dto.email.is_some() {
        let email = dto.email.unwrap_or_default();
        if get_user_by_email(state.db_pool(), &email).await?.is_some() {
            return Err(AppError::new(StatusCode::CONFLICT, "Email already exists"));
        }
        user.email = email;
    }

    if dto.github_id.is_some() {
        if get_user_by_github_id(state.db_pool(), dto.github_id.unwrap())
            .await?
            .is_some()
        {
            return Err(AppError::new(
                StatusCode::CONFLICT,
                "GitHub ID already exists",
            ));
        }
        user.github_id = dto.github_id;
    }

    if dto.password.is_some() {
        let password = dto.password.unwrap_or_default();
        user.password_hash = hash_password(&password)?;
    }

    if dto.avatar_url.is_some() {
        user.avatar_url = dto.avatar_url;
    }

    let user = services::update_user(state.db_pool(), &user).await?;
    Ok(SuccessResponse::ok(UserResDto::from(user)))
}
