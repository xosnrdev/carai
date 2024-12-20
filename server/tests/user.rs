use axum::{
    body::{to_bytes, Body},
    http::{Request, StatusCode},
};
use carai::{
    dto::{UserReqDto, UserResDto},
    utils::{CaraiResult, SuccessResponse},
};

use common::ctx;
use sqlx::PgPool;
use tower::ServiceExt;

mod common;

#[sqlx::test]
async fn test_register_user(db_pool: PgPool) -> CaraiResult<()> {
    // Arrange
    let app = ctx(db_pool)?;

    let req_dto = UserReqDto {
        username: Some("Heregoom1940".to_string()),
        email: Some("BiTsou@dayrep.com".to_string()),
        password: "em9Nie4U".to_string(),
        avatar_url: None,
        github_id: None,
    };

    let req = Request::builder()
        .uri("/users/register")
        .method("POST")
        .header("Content-Type", "application/json")
        .body(Body::from(serde_json::to_string(&req_dto)?))?;

    // Act
    let res = app.oneshot(req).await?;

    // Should return a JSON response equivalent to this:
    // {
    //     "status": 201,
    //     "body": {
    //         "username": "Heregoom1940",
    //         "email": "BiTsou@dayrep.com",
    //         "is_admin": false,
    //         "avatar_url": null,
    //         "github_id": null
    //     }
    // }

    // Assert
    assert_eq!(
        res.status(),
        StatusCode::CREATED,
        "User registration should return 201 Created"
    );

    let body = to_bytes(res.into_body(), usize::MAX).await?;

    let res = UserResDto {
        username: "heregoom1940".to_string(),
        email: "bitsou@dayrep.com".to_string(),
        is_admin: false,
        avatar_url: None,
        github_id: None,
    };

    let res_dto: SuccessResponse<UserResDto> = serde_json::from_slice(&body)?;

    assert_eq!(
        res_dto,
        SuccessResponse::created(res),
        "User registration response should match"
    );

    Ok(())
}
