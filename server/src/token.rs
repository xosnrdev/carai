use anyhow::{anyhow, bail};
use chrono::{DateTime, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::response::CaraiResult;

#[derive(Debug, Serialize, Deserialize, PartialEq)]
enum TokenType {
    Access,
    Refresh,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: Uuid,
    exp: i64,
    iat: i64,
    #[serde(rename = "typ")]
    token_type: TokenType,
    jti: Uuid,
    scope: Option<String>,
}

fn generate_token(claims: &Claims, secret: &[u8]) -> CaraiResult<String> {
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(secret),
    )
    .map_err(|e| anyhow!("Failed to generate token: {}", e))
}

fn verify_token(
    token: &str,
    secret: &[u8],
    token_type: &TokenType,
    current_time: &DateTime<Utc>,
) -> CaraiResult<Claims> {
    let validation = Validation::default();

    let token_data: TokenData<Claims> =
        decode(token, &DecodingKey::from_secret(secret), &validation)
            .map_err(|e| anyhow!("Failed to verify token: {}", e))?;

    let claims = token_data.claims;

    if &claims.token_type != token_type {
        bail!(
            "Token type mismatch: expected {:?}, found {:?}",
            token_type,
            claims.token_type
        );
    }

    if current_time.timestamp() > claims.exp {
        bail!("Token expired at {}", claims.exp);
    }

    if current_time.timestamp() < claims.iat {
        bail!("Token used before its issued at {}", claims.iat);
    }

    Ok(claims)
}

pub struct TokenManager<'a> {
    secret: &'a [u8],
}

impl<'a> TokenManager<'a> {
    pub fn new(secret: &'a [u8]) -> Self {
        Self { secret }
    }

    pub fn generate_access_token(
        &self,
        user_id: Uuid,
        expiration_time: DateTime<Utc>,
        issued_at: DateTime<Utc>,
        scope: Option<String>,
    ) -> CaraiResult<String> {
        let claims = Claims {
            sub: user_id,
            exp: expiration_time.timestamp(),
            iat: issued_at.timestamp(),
            token_type: TokenType::Access,
            jti: Uuid::new_v4(),
            scope,
        };

        generate_token(&claims, self.secret)
    }

    pub fn generate_refresh_token(
        &self,
        user_id: Uuid,
        expiration_time: DateTime<Utc>,
        issued_at: DateTime<Utc>,
    ) -> CaraiResult<String> {
        let claims = Claims {
            sub: user_id,
            exp: expiration_time.timestamp(),
            iat: issued_at.timestamp(),
            token_type: TokenType::Refresh,
            jti: Uuid::new_v4(),
            scope: None,
        };

        generate_token(&claims, self.secret)
    }

    pub fn validate_access_token(
        &self,
        token: &str,
        current_time: DateTime<Utc>,
    ) -> CaraiResult<Claims> {
        verify_token(token, self.secret, &TokenType::Access, &current_time)
    }

    pub fn validate_refresh_token(
        &self,
        token: &str,
        current_time: DateTime<Utc>,
    ) -> CaraiResult<Claims> {
        verify_token(token, self.secret, &TokenType::Refresh, &current_time)
    }
}
