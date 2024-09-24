use std::{net::TcpListener, time::Duration};

use actix_web::{dev::Server, App, HttpServer};

use crate::{
    api,
    config::{get_environment, prepare_settings, Settings},
};

pub struct Application {
    port: u16,
    server: Server,
}

impl Application {
    pub async fn build(config: Settings) -> Result<Self, anyhow::Error> {
        let address = format!(
            "{}:{}",
            config.server.listen_addr, config.server.listen_port
        );

        let listener = TcpListener::bind(address)?;
        let port = listener.local_addr().unwrap().port();

        let server = run(listener).await?;

        Ok(Self { port, server })
    }

    pub fn port(&self) -> u16 {
        self.port
    }

    pub async fn run_until_stopped(self) -> Result<(), std::io::Error> {
        self.server.await
    }
}

async fn run(listener: TcpListener) -> Result<Server, anyhow::Error> {
    let env = get_environment();

    let config = prepare_settings(&env);

    let worker_threads = config.server.worker_threads;

    let server = HttpServer::new(move || App::new().configure(api::config))
        .workers(worker_threads)
        .client_request_timeout(Duration::from_secs(60))
        .listen(listener)?
        .run();
    Ok(server)
}
