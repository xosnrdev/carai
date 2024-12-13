use axum::http::StatusCode;
use uuid::Uuid;
use validator::Validate;

use crate::{bootstrap::AppState, model::User, repositories, response::AppError};

pub fn validate_dto<T: Validate>(dto: &T) -> Result<(), AppError> {
    dto.validate()
        .map_err(|e| AppError::external(format!("{}", e), StatusCode::UNPROCESSABLE_ENTITY))
}

pub async fn fetch_user_by_id(state: &AppState, user_id: Uuid) -> Result<User, AppError> {
    repositories::read_user_by_id(state.db_pool(), user_id)
        .await?
        .ok_or_else(|| AppError::external("User not found", StatusCode::NOT_FOUND))
}
