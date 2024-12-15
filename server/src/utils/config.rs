use anyhow::Context;
use config::{Config, Environment};
use derive_more::derive::TryFrom;
use getset::Getters;
use serde::Deserialize;
use sqlx::postgres::{PgConnectOptions, PgSslMode};
use std::{str::FromStr, sync::LazyLock};

use crate::utils::CaraiResult;

pub static CONFIG: LazyLock<AppConfig> = LazyLock::new(|| AppConfig::new().expect("Error"));

#[derive(Debug, Deserialize, Getters, Clone)]
pub struct AppConfig {
    #[getset(get = "pub")]
    server: ServerConfig,
    #[getset(get = "pub")]
    database: DatabaseConfig,
    pub environment: AppEnvironment,
    #[getset(get = "pub")]
    jwt: JwtConfig,
    #[getset(get = "pub")]
    redis: RedisConfig,
    #[getset(get = "pub")]
    rate_limit: RateLimitConfig,
}

impl AppConfig {
    pub fn new() -> CaraiResult<Self> {
        Config::builder()
            .set_default("server.host", "127.0.0.1")?
            .set_default("server.port", 8000)?
            .set_default("server.timeout_in_secs", 10)?
            .set_default("server.origins", "localhost")?
            .set_default("database.host", "127.0.0.1")?
            .set_default("database.port", 5432)?
            .set_default("database.ssl_mode", "prefer")?
            .set_default("environment", "local")?
            .set_default("jwt.access_token_expiration_in_secs", 900)?
            .set_default("jwt.refresh_token_expiration_in_secs", 86400)?
            .set_default("redis.port", 6379)?
            .set_default("redis.host", "127.0.0.1")?
            .set_default("redis.db", 0)?
            .set_default("redis.tls_mode", false)?
            .set_default("rate_limit.requests_per_window", 100)?
            .set_default("rate_limit.window_size", 60)?
            .set_default("rate_limit.redis_uri", "redis://127.0.0.1")?
            .set_default("rate_limit.key_strategy", "token")?
            .add_source(Environment::with_prefix("APP").separator("__"))
            .build()?
            .try_deserialize()
            .context("Unable to deserialize configuration")
    }
}

#[derive(Debug, Deserialize, Getters, Clone)]
pub struct ServerConfig {
    #[getset(get = "pub")]
    host: String,
    #[getset(get = "pub")]
    port: u16,
    #[getset(get = "pub")]
    timeout_in_secs: u64,
    #[getset(get = "pub")]
    origins: String,
}

#[derive(Debug, Deserialize, Getters, Clone)]
pub struct DatabaseConfig {
    #[getset(get = "pub")]
    username: String,
    #[getset(get = "pub")]
    password: String,
    #[getset(get = "pub")]
    port: u16,
    #[getset(get = "pub")]
    host: String,
    #[getset(get = "pub")]
    name: String,
    #[getset(get = "pub")]
    ssl_mode: PgSslModeExt,
}

impl DatabaseConfig {
    pub fn to_pg_connect_options(&self) -> PgConnectOptions {
        PgConnectOptions::new()
            .username(&self.username)
            .password(&self.password)
            .port(self.port)
            .host(&self.host)
            .database(&self.name)
            .ssl_mode(self.ssl_mode.0)
    }
}

#[derive(Debug, Clone)]
pub struct PgSslModeExt(pub PgSslMode);

impl<'de> serde::Deserialize<'de> for PgSslModeExt {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        PgSslMode::from_str(&s)
            .map(PgSslModeExt)
            .map_err(serde::de::Error::custom)
    }
}

impl From<&str> for PgSslModeExt {
    fn from(s: &str) -> Self {
        PgSslModeExt(PgSslMode::from_str(s).unwrap_or_default())
    }
}

#[derive(Debug, Deserialize, TryFrom, Clone)]
pub enum AppEnvironment {
    Local,
    Production,
}

#[derive(Debug, Deserialize, Getters, Clone)]
pub struct JwtConfig {
    #[getset(get = "pub")]
    secret: String,
    #[getset(get = "pub")]
    access_token_expiration_in_secs: i64,
    #[getset(get = "pub")]
    refresh_token_expiration_in_secs: i64,
}

#[derive(Debug, Deserialize, Getters, Clone)]
pub struct RedisConfig {
    #[getset(get = "pub")]
    username: String,
    #[getset(get = "pub")]
    password: String,
    #[getset(get = "pub")]
    port: u16,
    #[getset(get = "pub")]
    host: String,
    #[getset(get = "pub")]
    db: i64,
    #[getset(get = "pub")]
    tls_mode: bool,
}

impl RedisConfig {
    pub fn to_connection_string(&self) -> String {
        let scheme = if self.tls_mode { "rediss" } else { "redis" };
        format!(
            "{}://{}:{}@{}:{}/{}",
            scheme, self.username, self.password, self.host, self.port, self.db
        )
    }

    pub fn to_connection_info(&self) -> CaraiResult<redis::ConnectionInfo> {
        redis::ConnectionInfo::from_str(&self.to_connection_string())
            .context("Unable to parse redis connection info")
    }
}

#[derive(Debug, Deserialize, Getters, Clone)]
pub struct RateLimitConfig {
    #[getset(get = "pub")]
    requests_per_window: usize,
    #[getset(get = "pub")]
    window_size: u64,
    #[getset(get = "pub")]
    redis_uri: String,
    #[getset(get = "pub")]
    key_strategy: KeyStrategy,
}

#[derive(Debug, Deserialize, Clone)]
pub enum KeyStrategy {
    Token,
    Ip,
    Mixed,
}
