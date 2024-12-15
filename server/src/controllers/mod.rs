mod auth;
mod health_check;
mod session;
mod user;

pub use auth::*;
use axum_extra::extract::cookie::{Cookie, SameSite};
pub use health_check::*;
pub use session::*;
pub use user::*;

pub(super) fn create_cookie_session(refresh_token: impl Into<String>, ttl: i64) -> Cookie<'static> {
    let max_age = time::Duration::seconds(ttl);
    Cookie::build(("refresh_token", refresh_token.into()))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .path("/")
        .max_age(max_age)
        .expires(time::OffsetDateTime::now_utc() + max_age)
        .build()
}
