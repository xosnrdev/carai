use std::fmt;

#[derive(Debug)]
pub enum Error {
    KeyNotFound(&'static str),
    Parse { key: &'static str, cause: String },
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Error::KeyNotFound(key) => write!(f, "Environment key not found: «{0}»", key),

            Error::Parse { key, cause } => write!(
                f,
                "Failed to parse value for environment key: «{0}», cause: {1}",
                key, cause
            ),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let key = "TEST_KEY";
        let cause = "Invalid integer".to_string();
        let error = Error::Parse { key, cause };

        assert_eq!(
            format!("{}", error),
            "Failed to parse value for environment key: «TEST_KEY», cause: Invalid integer"
        );

        let key = "TEST_KEY";
        let error = Error::KeyNotFound(key);

        assert_eq!(
            format!("{}", error),
            "Environment key not found: «TEST_KEY»"
        );
    }
}
