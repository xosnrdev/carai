use axum::{
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug)]
pub enum Message {
    Internal(anyhow::Error),
    External(String),
}

impl Message {
    pub fn to_internal(&self) -> String {
        match self {
            Message::Internal(err) => err.to_string(),
            _ => "An internal server error occurred.".to_string(),
        }
    }

    pub fn to_external(&self) -> String {
        match self {
            Message::External(msg) => msg.to_owned(),
            Message::Internal(msg) => msg.to_string(),
        }
    }
}

#[derive(Debug)]
pub struct AppError {
    status: u16,
    message: Message,
}

impl AppError {
    pub fn new(status: u16, message: Message) -> Self {
        Self { status, message }
    }

    pub fn internal(error: impl Into<anyhow::Error>) -> Self {
        Self {
            status: 500,
            message: Message::Internal(error.into()),
        }
    }

    pub fn external(message: String, status: u16) -> Self {
        Self {
            status,
            message: Message::External(message),
        }
    }

    pub fn to_error_response(&self) -> ErrorResponse {
        ErrorResponse {
            status: self.status,
            body: self.message.to_external(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        Json(self.to_error_response()).into_response()
    }
}

#[derive(Debug, Serialize)]
pub struct SuccessResponse<T: Serialize> {
    pub status: u16,
    pub body: T,
}

impl<T: Serialize> SuccessResponse<T> {
    pub fn new(body: T, status: u16) -> Self {
        Self { status, body }
    }

    pub fn ok(body: T) -> Self {
        Self::new(body, 200)
    }
}

impl<T: Serialize> IntoResponse for SuccessResponse<T> {
    fn into_response(self) -> Response {
        Json(self).into_response()
    }
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub status: u16,
    pub body: String,
}

macro_rules! process_error_from {
    ($error:ty) => {
        impl From<$error> for AppError {
            fn from(error: $error) -> Self {
                AppError::internal(error)
            }
        }
    };
}

process_error_from!(anyhow::Error);
process_error_from!(redis::RedisError);
process_error_from!(sqlx::Error);
process_error_from!(std::io::Error);
process_error_from!(config::ConfigError);

pub type CaraiResult<T> = anyhow::Result<T>;
