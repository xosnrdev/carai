use crate::response::{AppError, SuccessResponse};

use serde::Serialize;
use smart_default::SmartDefault;

#[derive(Serialize, SmartDefault)]
pub struct HealthCheckData {
    status: String,
    version: String,
    description: String,
}

const VERSION: &str = env!("CARGO_PKG_VERSION");

pub async fn health_check() -> Result<SuccessResponse<HealthCheckData>, AppError> {
    let data = HealthCheckData {
        status: "pass".to_string(),
        version: VERSION.to_string(),
        description: "Service is operational".to_string(),
    };

    Ok(SuccessResponse::new(data, 200))
}
