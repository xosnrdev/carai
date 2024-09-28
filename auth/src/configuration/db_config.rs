use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DbConfig {
    pub connection_string: String,
    pub schema_name: String,
    pub permission_table: String,
    pub role_table: String,
    pub user_table: String,
    pub audit_table: String,
    pub create_indexes: bool,
    pub audit_enabled: bool,
    pub audit_ttl: u64,
}

impl DbConfig {
    /// # Summary
    ///
    /// Creates a new DbConfig instance.
    ///
    /// ## Arguments
    ///
    /// * `connection_string` - A String that holds the connection string.
    /// * `schema_name` - A String that holds the schema name.
    /// * `permission_table` - A String that holds the permission table name.
    /// * `role_table` - A String that holds the role table name.
    /// * `user_table` - A String that holds the user table name.
    /// * `audit_table` - A String that holds the audit table name.
    /// * `create_indexes` - A bool that indicates whether to create indexes or not.
    /// * `audit_enabled` - A bool that indicates whether auditing is enabled or not.
    /// * `audit_ttl` - A u64 that holds the audit TTL.
    ///
    /// ## Returns
    ///
    /// A DbConfig instance.
    pub fn new(
        connection_string: String,
        schema_name: String,
        permission_table: String,
        role_table: String,
        user_table: String,
        audit_table: String,
        create_indexes: bool,
        audit_enabled: bool,
        audit_ttl: u64,
    ) -> DbConfig {
        DbConfig {
            connection_string,
            schema_name,
            permission_table,
            role_table,
            user_table,
            audit_table,
            create_indexes,
            audit_enabled,
            audit_ttl,
        }
    }
}
