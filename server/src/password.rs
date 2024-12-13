use anyhow::anyhow;
use argon2::{
    password_hash::{
        self, rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString,
    },
    Argon2,
};

use crate::response::CaraiResult;

pub fn hash_password(password: &[u8]) -> CaraiResult<String> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password, &salt)
        .map_err(|e| anyhow!("Failed to hash password: {}", e))
        .map(|hash| hash.to_string())
}

pub fn verify_password(password: &[u8], password_hash: &str) -> CaraiResult<bool> {
    let argon2 = Argon2::default();

    let hash = PasswordHash::new(password_hash)
        .map_err(|e| anyhow!("Failed to parse password hash: {}", e))?;

    match argon2.verify_password(password, &hash) {
        Ok(_) => Ok(true),
        Err(password_hash::Error::Password) => Ok(false),
        Err(e) => Err(anyhow!("Failed to verify password: {}", e)),
    }
}
