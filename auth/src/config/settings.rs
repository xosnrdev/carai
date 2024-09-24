use crate::error::Error;
use std::{collections::HashMap, env, fmt, process, str::FromStr};

#[derive(Clone, Debug)]
pub struct Settings {
    pub database: DatabaseSetting,
    pub server: ServerSetting,
}

#[derive(Clone, Debug)]
pub struct DatabaseSetting {
    pub username: String,
    pub password: String,
    pub host: String,
    pub port: u16,
    pub name: String,
}

#[derive(Clone, Debug)]
pub struct ServerSetting {
    pub listen_addr: String,
    pub listen_port: u16,
    pub worker_threads: usize,
}

pub type Environment = HashMap<String, String>;

pub fn get_environment() -> Environment {
    env::vars().collect()
}

pub fn lookup<T>(key: &'static str, environment: &Environment) -> Result<T, Error>
where
    T: FromStr,
    T::Err: fmt::Display,
{
    environment
        .get(key)
        .ok_or(Error::KeyNotFound(key))
        .and_then(|string_value| {
            string_value.parse::<T>().map_err(|err| Error::Parse {
                key,
                cause: err.to_string(),
            })
        })
}

pub fn lookup_optional<T>(key: &'static str, environment: &Environment) -> Result<Option<T>, Error>
where
    T: FromStr,
    T::Err: fmt::Display,
{
    match environment.get(key) {
        None => Ok(None),

        Some(string_value) => string_value
            .parse::<T>()
            .map(Some)
            .map_err(|err| Error::Parse {
                key,
                cause: err.to_string(),
            }),
    }
}

pub fn space_seperated_string(s: String) -> Vec<String> {
    s.split(" ")
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect()
}

pub fn prepare_settings(environment: &Environment) -> Settings {
    match build_settings(environment) {
        Ok(settings) => settings,
        Err(error) => {
            tracing::error!("{}", error);
            process::exit(1);
        }
    }
}

pub fn build_settings(environment: &Environment) -> Result<Settings, Error> {
    let database = build_database_setting(environment)?;
    let server = build_server_setting(environment)?;

    Ok(Settings { database, server })
}

pub fn build_database_setting(environment: &Environment) -> Result<DatabaseSetting, Error> {
    let username = lookup("DATABASE_USERNAME", environment)?;
    let password = lookup("DATABASE_PASSWORD", environment)?;
    let host = lookup("DATABASE_HOST", environment)?;
    let port = lookup("DATABASE_PORT", environment)?;
    let name = lookup("DATABASE_NAME", environment)?;

    Ok(DatabaseSetting {
        username,
        password,
        host,
        port,
        name,
    })
}

pub fn build_server_setting(environment: &Environment) -> Result<ServerSetting, Error> {
    let listen_addr = lookup("SERVER_LISTEN_ADDR", environment)?;
    let listen_port = lookup("SERVER_LISTEN_PORT", environment)?;
    let worker_threads = lookup("SERVER_WORKER_THREADS", environment)?;

    Ok(ServerSetting {
        listen_addr,
        listen_port,
        worker_threads,
    })
}
