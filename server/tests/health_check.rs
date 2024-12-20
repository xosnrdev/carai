use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use carai::utils::CaraiResult;
use common::ctx;
use sqlx::PgPool;
use tower::ServiceExt;

mod common;

// See https://github.com/launchbadge/sqlx/blob/main/examples/postgres/axum-social-with-tests/tests/user.rs
#[sqlx::test]
async fn test_health_check(db_pool: PgPool) -> CaraiResult<()> {
    // Arrange
    let app = ctx(db_pool)?;

    // Act
    let response = app
        .oneshot(Request::builder().uri("/").body(Body::empty())?)
        .await?;

    // Assert
    assert_eq!(
        response.status(),
        StatusCode::OK,
        "Health check endpoint should return 200 OK"
    );
    assert!(
        response.status().is_success(),
        "Health check endpoint should return 200 OK"
    );

    Ok(())
}
