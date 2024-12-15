#![deny(missing_docs)]
//! JWT token management module: encoding, decoding, validating JWTs.

use anyhow::bail;
use chrono::Duration;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use uuid::Uuid;

use super::{Claims, Typ};
use crate::utils::CaraiResult;

/// Manages encoding and decoding of JWT tokens.
pub struct TokenManager<'a> {
    secret: &'a [u8],
    /// Optional Key ID for key rotation or identification.
    kid: Option<String>,
}

impl<'a> TokenManager<'a> {
    /// Creates a new `TokenManager` with a given secret, algorithm, optional KID, and leeway.
    ///
    /// # Arguments
    ///
    /// * `secret` - The secret key bytes used for signing/verifying tokens.
    /// * `kid` - An optional Key ID, useful for key rotation scenarios.
    pub fn new(secret: &'a [u8], kid: Option<String>) -> Self {
        Self { secret, kid }
    }

    fn encode(
        &self,
        user_id: Uuid,
        email: &str,
        is_admin: bool,
        exp: Duration,
        typ: Typ,
    ) -> CaraiResult<(String, Claims)> {
        let mut header = Header::default();
        if let Some(kid) = &self.kid {
            header.kid = Some(kid.to_owned());
        }

        let claims = Claims::new(user_id, email, is_admin, exp, typ);
        let token = encode(&header, &claims, &EncodingKey::from_secret(self.secret))?;

        Ok((token, claims))
    }

    fn decode(&self, token: &str, typ: Typ) -> CaraiResult<Claims> {
        let mut validation = Validation::default();
        validation.set_issuer(&["carai_auth"]);
        validation.set_audience(&["carai_client"]);
        validation.set_required_spec_claims(&["exp", "aud", "iss", "sub"]);
        validation.leeway = 30;

        let token_data =
            match decode::<Claims>(token, &DecodingKey::from_secret(self.secret), &validation) {
                Ok(td) => td,
                Err(err) => bail!("{}", err),
            };

        if *token_data.claims.typ() != typ {
            bail!("Invalid token type");
        }

        Ok(token_data.claims)
    }

    /// Creates an access token for the given user with the specified duration.
    ///
    /// # Arguments
    ///
    /// * `user_id` - The user's unique identifier.
    /// * `email` - The user's email (subject claim).
    /// * `is_admin` - Whether the user has admin privileges.
    /// * `duration` - The validity duration of the token.
    pub fn create_access_token(
        &self,
        user_id: Uuid,
        email: &str,
        is_admin: bool,
        duration: Duration,
    ) -> CaraiResult<(String, Claims)> {
        self.encode(user_id, email, is_admin, duration, Typ::Access)
    }

    /// Creates a refresh token for the given user with the specified duration.
    ///
    /// # Arguments
    ///
    /// * `user_id` - The user's unique identifier.
    /// * `email` - The user's email (subject claim).
    /// * `is_admin` - Whether the user has admin privileges.
    /// * `duration` - The validity duration of the token.
    pub fn create_refresh_token(
        &self,
        user_id: Uuid,
        email: &str,
        is_admin: bool,
        duration: Duration,
    ) -> CaraiResult<(String, Claims)> {
        self.encode(user_id, email, is_admin, duration, Typ::Refresh)
    }

    /// Validates an access token and returns the decoded claims if valid.
    ///
    /// # Arguments
    ///
    /// * `token` - The JWT string.
    pub fn validate_access_token(&self, token: &str) -> CaraiResult<Claims> {
        self.decode(token, Typ::Access)
    }

    /// Validates a refresh token and returns the decoded claims if valid.
    ///
    /// # Arguments
    ///
    /// * `token` - The JWT string.
    pub fn validate_refresh_token(&self, token: &str) -> CaraiResult<Claims> {
        self.decode(token, Typ::Refresh)
    }
}
