#![deny(missing_docs)]
//! Application-wide response and error handling utilities.

use anyhow::Result;
use axum::{
    http::{header, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use serde::{Deserialize, Serialize};
use tracing::error;

/// Details about an error, including its HTTP status and message.
#[derive(Debug)]
pub struct ErrorDetails {
    /// The HTTP status code associated with the error.
    pub status: StatusCode,
    /// A user-facing error message.
    pub message: String,
}

impl ErrorDetails {
    /// Creates a new `ErrorDetails` instance.
    pub fn new(status: StatusCode, message: impl Into<String>) -> Self {
        Self {
            status,
            message: message.into(),
        }
    }
}

/// Represents an application-level error that can be converted into an HTTP response.
#[derive(Debug)]
pub struct AppError {
    details: ErrorDetails,
}

impl AppError {
    /// Creates a new `AppError` from a status and message.
    pub fn new(status: StatusCode, message: impl Into<String>) -> Self {
        Self {
            details: ErrorDetails::new(status, message),
        }
    }

    /// Logs an internal error and returns a 500 status.
    pub fn internal(log_message: impl Into<anyhow::Error>) -> Self {
        error!("error: {}", log_message.into());
        Self::new(StatusCode::INTERNAL_SERVER_ERROR, "internal server error")
    }

    /// Converts `AppError` into a `ErrorResponse`.
    pub fn into_error_response(&self) -> ErrorResponse {
        ErrorResponse {
            status: self.details.status.as_u16(),
            message: self.details.message.clone(),
        }
    }

    /// Provides direct read access to the error details.
    pub fn details(&self) -> &ErrorDetails {
        &self.details
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let response = Json(self.into_error_response()).into_response();
        add_security_headers(response, self.details.status)
    }
}

/// A successful response with a status code and serializable body.
#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct SuccessResponse<T: Serialize> {
    /// The HTTP status code as a u16.
    pub status: u16,
    /// The response body, which is serializable to JSON.
    pub body: T,
}

impl<T: Serialize> SuccessResponse<T> {
    /// Creates a new `SuccessResponse` with a given status and body.
    pub fn new(status: StatusCode, body: T) -> Self {
        Self {
            status: status.as_u16(),
            body,
        }
    }

    /// Creates a 200 OK response.
    pub fn ok(body: T) -> Self {
        Self::new(StatusCode::OK, body)
    }

    /// Creates a 201 Created response.
    pub fn created(body: T) -> Self {
        Self::new(StatusCode::CREATED, body)
    }
}

impl<T: Serialize> IntoResponse for SuccessResponse<T> {
    fn into_response(self) -> Response {
        let response = Json(&self).into_response();
        add_security_headers(response, StatusCode::from_u16(self.status).unwrap())
    }
}

/// An error response for the client, containing status and message.
#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    /// The HTTP status code as a u16.
    pub status: u16,
    /// A user-readable error message.
    pub message: String,
}

fn add_security_headers(mut response: Response, status: StatusCode) -> Response {
    *response.status_mut() = status;

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

macro_rules! impl_from_for_app_error {
    ($($error:ty),*) => {
        $(
            impl From<$error> for AppError {
                fn from(error: $error) -> Self {
                    AppError::internal(error)
                }
            }
        )*
    };
}

impl_from_for_app_error!(
    anyhow::Error,
    sqlx::Error,
    config::ConfigError,
    std::io::Error
);

/// A project-specific `Result` type using `anyhow::Error`.
pub type CaraiResult<T> = Result<T>;
