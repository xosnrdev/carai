use axum::{
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use smart_default::SmartDefault;

#[derive(Debug, Serialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Status {
    Success,
    Error,
}

impl From<&str> for Status {
    fn from(s: &str) -> Self {
        match s {
            "success" => Status::Success,
            _ => Status::Error,
        }
    }
}

#[derive(Debug)]
pub enum Message {
    Internal(anyhow::Error),
    External(String),
}

impl Message {
    pub fn to_internal(&self) -> String {
        match self {
            Message::Internal(err) => err.to_string(),
            Message::External(msg) => msg.to_owned(),
        }
    }

    pub fn to_external(&self) -> String {
        match self {
            Message::External(msg) => msg.to_owned(),
            _ => "An internal server error occurred.".to_string(),
        }
    }
}

#[derive(Debug)]
pub struct AppError {
    code: u16,
    message: Message,
}

impl AppError {
    pub fn new(code: u16, message: Message) -> Self {
        Self { code, message }
    }

    pub fn internal(error: impl Into<anyhow::Error>) -> Self {
        Self {
            code: 500,
            message: Message::Internal(error.into()),
        }
    }

    pub fn external(message: String, code: u16) -> Self {
        Self {
            code,
            message: Message::External(message),
        }
    }

    pub fn to_error_response(&self) -> ErrorResponse {
        ErrorResponse {
            code: self.code,
            message: self.message.to_external(),
            ..Default::default()
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        Json(self.to_error_response()).into_response()
    }
}

#[derive(Debug, Serialize, SmartDefault)]
pub struct SuccessResponse<T: Default> {
    #[default = "success"]
    status: Status,
    pub code: u16,
    pub data: T,
}

impl<T: Default + Serialize> SuccessResponse<T> {
    pub fn new(data: T, code: u16) -> Self {
        Self {
            code,
            data,
            ..Default::default()
        }
    }
}

impl<T: Default + Serialize> IntoResponse for SuccessResponse<T> {
    fn into_response(self) -> Response {
        Json(self).into_response()
    }
}

#[derive(Debug, Serialize, SmartDefault)]
pub struct ErrorResponse {
    #[default = "error"]
    status: Status,
    code: u16,
    message: String,
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
