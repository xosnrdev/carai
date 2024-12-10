mod auth;
mod refresh_token;
mod user;

pub use auth::*;
pub use refresh_token::*;
pub use user::*;

use serde::{Deserialize, Deserializer};

pub(super) fn to_lowercase<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    let value = String::deserialize(deserializer)?;

    Ok(value.to_lowercase())
}
