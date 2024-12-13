use std::{net::SocketAddr, time::Duration};

use anyhow::Context;
use axum::{
    extract::FromRef,
    http::{HeaderValue, Method},
    routing::{delete, get, patch, post},
    serve, Router,
};
use axum_extra::extract::cookie::Key;
use getset::Getters;
use sqlx::{postgres::PgPoolOptions, PgPool};
use tokio::{net::TcpListener, signal};
use tower_http::{cors::CorsLayer, timeout::TimeoutLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::{
    config::{AppConfig, DatabaseConfig},
    controllers::{
        delete_me_handler, get_me_handler, health_check_handler, login_handler, logout_handler,
        refresh_token_handler, register_handler, update_me_handler,
    },
    response::CaraiResult,
};

pub async fn run_application(config: AppConfig) -> CaraiResult<()> {
    init_tracing()?;

    let db_pool = create_connection_pool(config.database());

    let app = create_router(db_pool, config.clone());

    let address = SocketAddr::new(config.server().host().parse()?, *config.server().port());

    let listener = TcpListener::bind(address).await?;

    tracing::info!("Listening on {}:{}", address.ip(), address.port());
    serve(listener, app.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await
        .context("Failed to start server")
}

fn init_tracing() -> CaraiResult<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!(
                    "{}=debug,tower_http=debug,axum=trace",
                    env!("CARGO_CRATE_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer().without_time())
        .try_init()
        .context("Failed to initialize tracing")
}

fn create_connection_pool(config: &DatabaseConfig) -> PgPool {
    PgPoolOptions::new().connect_lazy_with(config.to_pg_connect_options())
}

#[derive(Debug, Clone, Getters)]
pub struct AppState {
    #[getset(get = "pub")]
    db_pool: PgPool,
    #[getset(get = "pub")]
    config: AppConfig,
    #[getset(get = "pub")]
    key: Key,
}

impl FromRef<AppState> for Key {
    fn from_ref(state: &AppState) -> Self {
        state.key.to_owned()
    }
}

fn create_router(db_pool: PgPool, config: AppConfig) -> Router {
    let key = Key::generate();
    let state = AppState {
        db_pool,
        config,
        key,
    };
    let timeout = Duration::from_secs(*state.config.server().timeout_in_secs());
    let origins: Vec<HeaderValue> = state
        .config
        .server()
        .origins()
        .split_whitespace()
        .filter_map(|s| s.parse::<HeaderValue>().ok())
        .collect();

    let users_router = Router::new()
        .route("/me", get(get_me_handler))
        .route("/me", patch(update_me_handler))
        .route("/me", delete(delete_me_handler))
        .route("/me", post(logout_handler));

    let auth_router = Router::new()
        .route("/login", post(login_handler))
        .route("/register", post(register_handler))
        .route("/refresh-token", post(refresh_token_handler));

    Router::new()
        .route("/health", get(health_check_handler))
        .nest("/users", users_router)
        .nest("/auth", auth_router)
        .layer((
            TraceLayer::new_for_http(),
            TimeoutLayer::new(timeout),
            CorsLayer::new()
                .allow_origin(origins)
                .allow_methods([
                    Method::GET,
                    Method::POST,
                    Method::DELETE,
                    Method::PUT,
                    Method::PATCH,
                ])
                .allow_credentials(true),
        ))
        .with_state(state)
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C signal handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("Failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}
