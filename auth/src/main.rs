use std::fmt::{Debug, Display};

use auth::{
    config,
    startup::Application,
    telemetry::{get_subscriber, init_subscriber},
};
use tokio::{spawn, task::JoinError};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let subscriber = get_subscriber("auth".into(), "info".into(), std::io::stdout);
    init_subscriber(subscriber);

    let env = config::get_environment();

    let config = config::prepare_settings(&env);

    let application = Application::build(config.clone()).await?;

    let application_task = spawn(application.run_until_stopped());

    tokio::select! {
        o = application_task => report_exit("API", o),
    };

    Ok(())
}

fn report_exit(
    task_name: &'static str,
    outcome: Result<Result<(), impl Debug + Display>, JoinError>,
) {
    match outcome {
        Ok(Ok(())) => {
            tracing::info!("{} has exited.", task_name)
        }
        Ok(Err(e)) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{} failed.",
                task_name
            )
        }
        Err(e) => {
            tracing::error!(
                error.cause_chain = ?e,
                error.message = %e,
                "{}' task failed to complete.",
                task_name
            )
        }
    }
}
