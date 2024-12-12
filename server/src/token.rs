use anyhow::{anyhow, bail};
use chrono::{DateTime, Utc};
use derive_more::derive::Display;
use getset::Getters;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::response::CaraiResult;

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
enum TokenType {
    Access,
    Refresh,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Role {
    Admin,
    User,
}

#[derive(Debug, Serialize, Deserialize, Getters, Display)]
#[display(
    "Claims: {{ sub: {}, exp: {}, iat: {}, typ: {:?}, jti: {}, role: {:?} }}",
    sub,
    exp,
    iat,
    token_type,
    jti,
    role
)]
pub struct Claims {
    #[getset(get = "pub")]
    sub: Uuid,
    #[getset(get = "pub")]
    exp: i64,
    iat: i64,
    #[serde(rename = "typ")]
    token_type: TokenType,
    jti: Uuid,
    #[getset(get = "pub")]
    role: Vec<Role>,
}

impl Claims {
    fn get_expires_in(&self) -> i64 {
        self.exp - self.iat
    }
}

fn generate_token(claims: &Claims, secret: &[u8]) -> CaraiResult<String> {
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(secret),
    )
    .map_err(|e| anyhow!("Failed to generate token: {}", e))
}

fn decode_token(token: &str, secret: &[u8]) -> CaraiResult<Claims> {
    let validation = Validation::default();

    let token_data: TokenData<Claims> =
        decode(token, &DecodingKey::from_secret(secret), &validation)
            .map_err(|e| anyhow!("Failed to decode token: {}", e))?;

    Ok(token_data.claims)
}

fn verify_token(
    token: &str,
    secret: &[u8],
    token_type: &TokenType,
    now: &DateTime<Utc>,
) -> CaraiResult<Claims> {
    let claims = decode_token(token, secret)?;

    if &claims.token_type != token_type {
        bail!(
            "Token type mismatch: expected {:?}, found {:?}",
            token_type,
            claims.token_type
        );
    }

    if now.timestamp() > claims.exp {
        bail!("Token expired at {}", claims.exp);
    }

    if now.timestamp() < claims.iat {
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
        expires_at: DateTime<Utc>,
        issued_at: DateTime<Utc>,
        role: Vec<Role>,
    ) -> CaraiResult<String> {
        let claims = Claims {
            sub: user_id,
            exp: expires_at.timestamp(),
            iat: issued_at.timestamp(),
            token_type: TokenType::Access,
            jti: Uuid::new_v4(),
            role,
        };

        generate_token(&claims, self.secret)
    }

    pub fn generate_refresh_token(
        &self,
        user_id: Uuid,
        expires_at: DateTime<Utc>,
        issued_at: DateTime<Utc>,
    ) -> CaraiResult<String> {
        let claims = Claims {
            sub: user_id,
            exp: expires_at.timestamp(),
            iat: issued_at.timestamp(),
            token_type: TokenType::Refresh,
            jti: Uuid::new_v4(),
            role: Vec::new(),
        };

        generate_token(&claims, self.secret)
    }

    pub fn validate_access_token(&self, token: &str, now: DateTime<Utc>) -> CaraiResult<Claims> {
        verify_token(token, self.secret, &TokenType::Access, &now)
    }

    pub fn validate_refresh_token(&self, token: &str, now: DateTime<Utc>) -> CaraiResult<Claims> {
        verify_token(token, self.secret, &TokenType::Refresh, &now)
    }

    pub fn get_expires_in(&self, token: &str) -> CaraiResult<i64> {
        let claims = decode_token(token, self.secret)?;

        Ok(claims.get_expires_in())
    }
}
