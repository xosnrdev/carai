#![deny(missing_docs)]
//! JWT Claims definition for Access and Refresh tokens.

use chrono::{Duration, Utc};
use getset::Getters;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// The type of token represented by these claims.
#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub enum Typ {
    /// An access token that grants access to protected resources.
    Access,
    /// A refresh token used to obtain new access tokens.
    Refresh,
}

/// Represents the JWT claims included in a token.
#[derive(Debug, Serialize, Deserialize, Getters)]
#[serde(rename_all = "camelCase")]
pub struct Claims {
    /// A unique identifier for the token (often the user ID).
    #[getset(get = "pub")]
    jti: Uuid,
    /// The subject of the token, typically the user's email.
    #[getset(get = "pub")]
    sub: String,
    /// The intended audience for the token.
    aud: String,
    /// The issuer of the token.
    iss: String,
    /// Indicates whether the user is an administrator.
    #[getset(get = "pub")]
    is_admin: bool,
    /// The time at which the token was issued, in Unix timestamp format.
    #[getset(get = "pub")]
    iat: i64,
    /// The expiration time of the token, in Unix timestamp format.
    #[getset(get = "pub")]
    exp: i64,
    /// The type of token (Access or Refresh).
    #[getset(get = "pub")]
    typ: Typ,
}

impl Claims {
    /// Creates a new `Claims` object.
    ///
    /// # Arguments
    ///
    /// * `user_id` - The user's unique identifier.
    /// * `email` - The user's email (used as `sub`).
    /// * `is_admin` - Whether the user has admin privileges.
    /// * `exp` - The duration until the token expires.
    /// * `typ` - The type of token (Access or Refresh).
    pub fn new(
        user_id: Uuid,
        email: impl Into<String>,
        is_admin: bool,
        exp: Duration,
        typ: Typ,
    ) -> Self {
        let now = Utc::now();
        Self {
            jti: user_id,
            sub: email.into(),
            aud: "carai_client".to_string(),
            iss: "carai_auth".to_string(),
            is_admin,
            iat: now.timestamp(),
            exp: (now + exp).timestamp(),
            typ,
        }
    }
}
