# K2 Account System - Netlify Functions

This directory contains serverless functions for the K2 Account System, designed to run on Netlify.

## Setup Instructions

### 1. MongoDB Setup

1. Create a MongoDB Atlas account or use an existing one
2. Create a new cluster and database named `k2accounts`
3. Create a database user with read/write permissions
4. Get your MongoDB connection string

### 2. Netlify Environment Variables

Set the following environment variables in your Netlify site settings:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT token signing

### 3. Function Dependencies

The functions require the following npm packages:
- mongodb
- bcryptjs
- jsonwebtoken

These are specified in the package.json file.

### 4. Deployment

When you push to your repository, Netlify will automatically build and deploy the functions.

## API Endpoints

The API provides the following endpoints:

- **Register**: `/.netlify/functions/account?action=register` (POST)
  - Creates a new user account
  - Required fields: username, email, password

- **Login**: `/.netlify/functions/account?action=login` (POST)
  - Authenticates a user
  - Required fields: username, password

- **Save Program**: `/.netlify/functions/account?action=save_program` (POST)
  - Saves a program to the user's account
  - Required fields: user_id, token, name, code
  - Optional fields: program_id (for updating existing program)

- **Get Programs**: `/.netlify/functions/account?action=get_programs` (GET)
  - Retrieves all programs for a user
  - Required query parameters: user_id, token

- **Delete Program**: `/.netlify/functions/account?action=delete_program` (DELETE)
  - Deletes a program from the user's account
  - Required fields: user_id, token, program_id

- **Upgrade Tier**: `/.netlify/functions/account?action=upgrade` (PUT)
  - Upgrades a user's account tier
  - Required fields: user_id, token, tier

## Security Considerations

For a production environment:

1. Use a strong JWT_SECRET
2. Set appropriate CORS headers (already configured in the function)
3. Consider adding rate limiting
4. Add additional validation for user inputs
5. Consider adding captcha for registration to prevent spam

## Troubleshooting

- Check Netlify function logs for errors
- Ensure MongoDB connection string is correct
- Verify that all required environment variables are set
- Test API endpoints using a tool like Postman or curl