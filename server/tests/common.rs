use anyhow::{bail, Context};
use carai::{
    bootstrap::create_connection_pool,
    utils::{AppConfig, CaraiResult, DatabaseConfig},
};
use sqlx::{migrate, postgres::PgQueryResult, Executor, PgPool};
use std::env;

pub struct TestContext {
    pub db_pool: PgPool,
    pub db_name: String,
    pub maintenance_db_config: DatabaseConfig,
    pub config: AppConfig,
}

impl TestContext {
    pub fn new() -> CaraiResult<Self> {
        let mut config = AppConfig::new()?;

        let db_name = format!(
            "carai_test_{}",
            uuid::Uuid::new_v4().to_string().replace("-", "_")
        );

        let db_username = env::var("TEST_DB_USERNAME").context("TEST_DB_USERNAME is not set")?;
        let db_password = env::var("TEST_DB_PASSWORD").context("TEST_DB_PASSWORD is not set")?;

        config.database_mut().set_username(db_username);
        config.database_mut().set_password(db_password);
        config.database_mut().set_name("anonymous".to_string());

        let db_pool = create_connection_pool(config.database());
        let mut maintenance_db_config = config.database().to_owned();
        maintenance_db_config.set_name("postgres".to_string());

        Ok(Self {
            db_pool,
            db_name,
            maintenance_db_config,
            config,
        })
    }

    pub async fn create_maintenance_db(&self) -> CaraiResult<(PgPool, PgQueryResult)> {
        let maintenance_pool =
            PgPool::connect_with(self.maintenance_db_config.to_pg_connect_options())
                .await
                .context("Failed to connect to the maintenance database")?;
        let result = maintenance_pool
            .execute(format!(r#"CREATE DATABASE "{}""#, self.db_name).as_str())
            .await
            .context("Failed to create the test database")?;

        Ok((maintenance_pool, result))
    }

    #[allow(dead_code)]
    pub async fn migrate(&self) -> CaraiResult<()> {
        migrate!()
            .run(&self.db_pool)
            .await
            .context("Failed to run the migrations")
    }
}

pub async fn cleanup(db_pool: &PgPool, db_name: &str) -> CaraiResult<()> {
    db_pool.close().await;

    let query = format!(r#"DROP DATABASE IF EXISTS "{}" WITH (FORCE)"#, db_name);

    let ctx = TestContext::new()?;

    let (maintenance_pool, _) = ctx.create_maintenance_db().await?;

    if let Err(e) = maintenance_pool.execute(query.as_str()).await {
        bail!("Failed to drop the test database {}: {}", db_name, e);
    }

    Ok(())
}
