mod auth;
mod session;
mod user;

pub use auth::*;
use axum::http::StatusCode;
pub use session::*;
pub use user::*;

use serde::{Deserialize, Deserializer};

use crate::utils::AppError;

pub(super) fn to_lowercase<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: Deserializer<'de>,
{
    let value = String::deserialize(deserializer)?;
    Ok(Some(value.to_lowercase()))
}

pub fn process_optional_fields(
    username: Option<String>,
    email: Option<String>,
) -> Result<(String, String), AppError> {
    // Check if either username or email is provided
    if username.is_none() && email.is_none() {
        return Err(AppError::new(
            StatusCode::UNPROCESSABLE_ENTITY,
            "Missing username or email",
        ));
    }

    let username = username.unwrap_or_default();
    let email = email.unwrap_or_default();

    Ok((username, email))
}
