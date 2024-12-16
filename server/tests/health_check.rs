mod common;

use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use carai::{bootstrap::create_router, utils::CaraiResult};
use common::{cleanup, TestContext};
use tower::util::ServiceExt;

#[tokio::test]
async fn test_health_check() -> CaraiResult<()> {
    let TestContext {
        db_pool,
        config,
        db_name,
        ..
    } = TestContext::new()?;
    let app = create_router(db_pool.to_owned(), config);

    let response = app
        .oneshot(Request::builder().uri("/").body(Body::empty())?)
        .await?;

    assert_eq!(
        response.status(),
        StatusCode::OK,
        "Health check endpoint should return 200 OK"
    );
    assert!(
        response.status().is_success(),
        "Health check endpoint should return 200 OK"
    );

    // Explicit cleanup
    cleanup(&db_pool, &db_name).await?;

    Ok(())
}
