use anyhow::Context;
use carai::{
    bootstrap::run_application,
    utils::{CaraiResult, CONFIG},
};

#[tokio::main]
async fn main() -> CaraiResult<()> {
    dotenv::dotenv().context("Failed to load .env file")?;
    run_application(CONFIG.to_owned()).await
}
