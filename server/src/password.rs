use anyhow::anyhow;
use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

use crate::response::CaraiResult;

pub fn hash_password_with_salt(password: &[u8], salt: &str) -> CaraiResult<String> {
    let salt_string = SaltString::from_b64(salt)
        .map_err(|e| anyhow!("Failed to decode salt from base64: {}", e))?;

    Argon2::default()
        .hash_password(password, &salt_string)
        .map_err(|e| anyhow!("Failed to hash password: {}", e))
        .map(|hash| hash.to_string())
}

pub fn verify_password(password: &[u8], password_hash: &str) -> CaraiResult<bool> {
    let argon2 = Argon2::default();

    let hash = PasswordHash::new(password_hash)
        .map_err(|e| anyhow!("Failed to parse password hash: {}", e))?;

    argon2
        .verify_password(password, &hash)
        .map(|_| true)
        .map_err(|e| anyhow!("Failed to verify password: {}", e))
}
