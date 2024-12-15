use anyhow::anyhow;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2, PasswordHash, PasswordVerifier,
};

use super::CaraiResult;

pub fn hash_password(password: &str) -> CaraiResult<String> {
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| anyhow!("Unable to hash password ({})", e))
        .map(|hash| hash.to_string())
}

pub fn check_password(password: &str, password_hash: &str) -> CaraiResult<bool> {
    let argon2 = Argon2::default();

    let hash = PasswordHash::new(password_hash)
        .map_err(|e| anyhow!("Unable to parse password ({})", e))?;

    match argon2.verify_password(password.as_bytes(), &hash) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}
