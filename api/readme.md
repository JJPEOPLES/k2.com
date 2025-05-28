# K2 Account System API

This directory contains the server-side components for the K2 Account System.

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database for the K2 Account System:

```bash
mysql -u root -p < schema.sql
```

This will:
- Create the `k2_accounts` database
- Create all necessary tables (users, programs, forum tables)
- Create a database user with appropriate permissions
- Insert default forum categories

### 2. PHP Configuration

1. Make sure your web server (Apache, Nginx, etc.) is configured to serve PHP files.
2. Ensure the PHP PDO extension is enabled for MySQL connectivity.
3. Update the database credentials in `account.php` if needed:

```php
// Database configuration
$db_host = "localhost";
$db_name = "k2_accounts";
$db_user = "k2_user";
$db_pass = "k2_password"; // In production, use environment variables for credentials
```

### 3. API Endpoints

The API provides the following endpoints:

- **Register**: `account.php?action=register` (POST)
  - Creates a new user account
  - Required fields: username, email, password

- **Login**: `account.php?action=login` (POST)
  - Authenticates a user
  - Required fields: username, password

- **Update Account**: `account.php?action=update` (PUT)
  - Updates user account information
  - Required fields: id, token
  - Optional fields: email, password

- **Save Program**: `account.php?action=save_program` (POST)
  - Saves a program to the user's account
  - Required fields: user_id, token, name, code
  - Optional fields: program_id (for updating existing program)

- **Get Programs**: `account.php?action=get_programs` (GET)
  - Retrieves all programs for a user
  - Required query parameters: user_id, token

- **Delete Program**: `account.php?action=delete_program` (DELETE)
  - Deletes a program from the user's account
  - Required fields: user_id, token, program_id

- **Upgrade Tier**: `account.php?action=upgrade` (PUT)
  - Upgrades a user's account tier
  - Required fields: user_id, token, tier

### 4. Security Considerations

For a production environment:

1. Use HTTPS for all API requests
2. Implement proper token-based authentication (JWT recommended)
3. Store database credentials in environment variables
4. Implement rate limiting to prevent abuse
5. Add CSRF protection for sensitive operations
6. Consider adding captcha for registration to prevent spam

## Integration with Frontend

The frontend JavaScript in `accounts.js` is already configured to communicate with this API. The API URL is set in the `K2AccountSystem.apiUrl` property and can be updated if needed.

## Troubleshooting

- Check PHP error logs if the API is not responding
- Ensure database connection details are correct
- Verify that the database user has appropriate permissions
- Test API endpoints using a tool like Postman or curl