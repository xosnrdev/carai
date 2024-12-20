use anyhow::Ok;
use axum::Router;
use carai::{
    bootstrap::create_router,
    utils::{AppConfig, CaraiResult},
};
use sqlx::PgPool;

pub fn ctx(db_pool: PgPool) -> CaraiResult<Router> {
    dotenv::dotenv().ok();
    let config = AppConfig::new()?;

    Ok(create_router(db_pool, config))
}
