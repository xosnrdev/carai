use crate::response::{AppError, SuccessResponse};
use serde::Serialize;

#[derive(Serialize)]
pub struct ServiceInfo {
    name: String,
    version: String,
    description: String,
}

const VERSION: &str = env!("CARGO_PKG_VERSION");

pub async fn health_check() -> Result<SuccessResponse<ServiceInfo>, AppError> {
    let body = ServiceInfo {
        name: "Carai".to_string(),
        version: VERSION.to_string(),
        description: "Backend service for Carai".to_string(),
    };
    Ok(SuccessResponse::ok(body))
}
