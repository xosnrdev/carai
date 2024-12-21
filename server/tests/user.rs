use std::borrow::BorrowMut;

use axum::{
    body::{to_bytes, Body},
    http::{Request, StatusCode},
};
use carai::{
    dto::{LoginReqDto, LoginResDto, UserReqDto, UserResDto},
    utils::{CaraiResult, SuccessResponse},
};

use common::ctx;
use sqlx::PgPool;
use tower::ServiceExt;

mod common;

#[sqlx::test]
async fn test_user(db_pool: PgPool) -> CaraiResult<()> {
    let mut app = ctx(db_pool)?;

    // Arrange: Register request data transfer object
    let register_req_dto = UserReqDto {
        username: Some("Heregoom1940".to_string()),
        email: Some("BiTsou@dayrep.com".to_string()),
        password: "em9Nie4U".to_string(),
        avatar_url: None,
        github_id: None,
    };

    let register_req = Request::builder()
        .uri("/users/register")
        .method("POST")
        .header("Content-Type", "application/json")
        .body(Body::from(serde_json::to_string(&register_req_dto)?))?;

    // Act: Send the registration request
    let register_res = app.borrow_mut().oneshot(register_req).await?;

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

    // Assert: Verify registration response
    assert_eq!(
        register_res.status(),
        StatusCode::CREATED,
        "User registration should return 201 Created"
    );

    let body = to_bytes(register_res.into_body(), usize::MAX).await?;

    let user_res_dto = UserResDto {
        username: "heregoom1940".to_string(),
        email: "bitsou@dayrep.com".to_string(),
        is_admin: false,
        avatar_url: None,
        github_id: None,
    };

    let register_res_dto: SuccessResponse<UserResDto> = serde_json::from_slice(&body)?;

    assert_eq!(
        register_res_dto,
        SuccessResponse::created(user_res_dto),
        "User registration response should match"
    );

    // Arrange: Login request data transfer object
    let login_req_dto = LoginReqDto {
        username: Some("Heregoom1940".to_string()),
        email: Some("BiTsou@dayrep.com".to_string()),
        password: "em9Nie4U".to_string(),
    };

    let login_req = Request::builder()
        .uri("/auth/login")
        .method("POST")
        .header("Content-Type", "application/json")
        .body(Body::from(serde_json::to_string(&login_req_dto)?))?;

    // Act: Send the login request
    let login_res = app.oneshot(login_req).await?;

    // Assert: Verify login response
    assert_eq!(
        login_res.status(),
        StatusCode::CREATED,
        "User login should return 201 Created"
    );

    let body = to_bytes(login_res.into_body(), usize::MAX).await?;
    let login_res_dto: SuccessResponse<LoginResDto> = serde_json::from_slice(&body)?;

    let session_id = login_res_dto.body.session_id;
    assert!(
        !session_id.is_nil(),
        "Session ID should be a valid UUID and not nil"
    );

    assert!(
        !login_res_dto.body.access_token.is_empty(),
        "Access token should not be empty"
    );
    assert!(
        !login_res_dto.body.refresh_token.is_empty(),
        "Refresh token should not be empty"
    );

    const ACCESS_TOKEN_DURATION: i64 = 900;
    const REFRESH_TOKEN_DURATION: i64 = 86400;

    assert_eq!(
        login_res_dto.body.access_token_expires_at, ACCESS_TOKEN_DURATION,
        "Access token expiration duration should be {} seconds (15 minutes)",
        ACCESS_TOKEN_DURATION
    );

    assert_eq!(
        login_res_dto.body.refresh_token_expires_at, REFRESH_TOKEN_DURATION,
        "Refresh token expiration duration should be {} seconds (1 day)",
        REFRESH_TOKEN_DURATION
    );

    assert_eq!(
        login_res_dto.body.user, register_res_dto.body,
        "User login response should match"
    );

    Ok(())
}
