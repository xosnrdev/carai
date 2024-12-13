use axum::{
    http::{header, HeaderValue, StatusCode},
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
            _ => "An internal error occurred".to_owned(),
        }
    }

    pub fn to_external(&self) -> String {
        match self {
            Message::External(msg) => msg.to_owned(),
            Message::Internal(err) => err.to_string(),
        }
    }
}

#[derive(Debug)]
pub struct AppError {
    status: StatusCode,
    message: Message,
}

impl AppError {
    pub fn new(status: StatusCode, message: Message) -> Self {
        Self { status, message }
    }

    pub fn internal(error: impl Into<anyhow::Error>) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: Message::Internal(error.into()),
        }
    }

    pub fn external(message: impl Into<String>, status: StatusCode) -> Self {
        Self {
            status,
            message: Message::External(message.into()),
        }
    }

    pub fn to_error_response(&self) -> ErrorResponse {
        ErrorResponse {
            status: self.status.as_u16(),
            body: self.message.to_external(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let error_response = Json(self.to_error_response()).into_response();

        let mut response = error_response;
        *response.status_mut() = self.status;

        let headers = response.headers_mut();
        headers.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
        headers.insert(header::PRAGMA, HeaderValue::from_static("no-cache"));
        headers.insert(
            header::STRICT_TRANSPORT_SECURITY,
            HeaderValue::from_static("max-age=31536000; includeSubDomains; preload"),
        );
        headers.insert(
            header::X_CONTENT_TYPE_OPTIONS,
            HeaderValue::from_static("nosniff"),
        );
        headers.insert(header::X_FRAME_OPTIONS, HeaderValue::from_static("DENY"));
        headers.insert(
            header::X_XSS_PROTECTION,
            HeaderValue::from_static("1; mode=block"),
        );
        headers.insert(
            header::REFERRER_POLICY,
            HeaderValue::from_static("no-referrer"),
        );

        response
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

    pub fn created(body: T) -> Self {
        Self::new(body, 201)
    }

    pub fn no_content(body: T) -> Self {
        Self::new(body, 204)
    }
}

impl<T: Serialize> IntoResponse for SuccessResponse<T> {
    fn into_response(self) -> Response {
        let mut response = Json(&self).into_response();

        *response.status_mut() = StatusCode::from_u16(self.status).unwrap();

        let headers = response.headers_mut();
        headers.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
        headers.insert(header::PRAGMA, HeaderValue::from_static("no-cache"));
        headers.insert(
            header::STRICT_TRANSPORT_SECURITY,
            HeaderValue::from_static("max-age=31536000; includeSubDomains; preload"),
        );
        headers.insert(
            header::X_CONTENT_TYPE_OPTIONS,
            HeaderValue::from_static("nosniff"),
        );
        headers.insert(header::X_FRAME_OPTIONS, HeaderValue::from_static("DENY"));
        headers.insert(
            header::X_XSS_PROTECTION,
            HeaderValue::from_static("1; mode=block"),
        );
        headers.insert(
            header::REFERRER_POLICY,
            HeaderValue::from_static("no-referrer"),
        );

        response
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
