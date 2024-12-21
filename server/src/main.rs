use carai::{
    bootstrap::run_application,
    utils::{CaraiResult, CONFIG},
};

#[tokio::main]
async fn main() -> CaraiResult<()> {
    dotenv::dotenv().ok();
    run_application(CONFIG.to_owned()).await
}
