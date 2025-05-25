<?php
/**
 * K2 Account API
 * Handles account operations (register, login, update, etc.)
 */

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Database configuration
$db_host = "localhost";
$db_name = "k2_accounts";
$db_user = "k2_user";
$db_pass = "k2_password"; // In production, use environment variables for credentials

// Connect to database
function connectDB() {
    global $db_host, $db_name, $db_user, $db_pass;
    
    try {
        $conn = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        returnError("Database connection failed: " . $e->getMessage());
        return null;
    }
}

// Get request method and data
$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// Handle preflight OPTIONS request
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Route the request based on action
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'register':
        if ($method === 'POST') {
            registerUser($data);
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    case 'login':
        if ($method === 'POST') {
            loginUser($data);
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    case 'update':
        if ($method === 'PUT') {
            updateUser($data);
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    case 'save_program':
        if ($method === 'POST') {
            saveProgram($data);
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    case 'get_programs':
        if ($method === 'GET') {
            getPrograms();
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    case 'delete_program':
        if ($method === 'DELETE') {
            deleteProgram($data);
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    case 'upgrade':
        if ($method === 'PUT') {
            upgradeTier($data);
        } else {
            returnError("Method not allowed", 405);
        }
        break;
        
    default:
        returnError("Invalid action", 400);
        break;
}

// Register a new user
function registerUser($data) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        returnError("Invalid email format", 400);
        return;
    }
    
    // Validate username (alphanumeric, 3-20 chars)
    if (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        returnError("Username must be 3-20 characters and contain only letters, numbers, and underscores", 400);
        return;
    }
    
    // Validate password (at least 8 chars)
    if (strlen($password) < 8) {
        returnError("Password must be at least 8 characters", 400);
        return;
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        // Check if username or email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        
        if ($stmt->rowCount() > 0) {
            returnError("Username or email already exists", 409);
            return;
        }
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, tier, join_date) VALUES (?, ?, ?, 'free', NOW())");
        $stmt->execute([$username, $email, $hashed_password]);
        
        // Get the new user ID
        $user_id = $conn->lastInsertId();
        
        // Return success with user data (except password)
        returnSuccess([
            'id' => $user_id,
            'username' => $username,
            'email' => $email,
            'tier' => 'free',
            'join_date' => date('Y-m-d H:i:s')
        ]);
        
    } catch(PDOException $e) {
        returnError("Registration failed: " . $e->getMessage());
    }
}

// Login a user
function loginUser($data) {
    // Validate required fields
    if (!isset($data['username']) || !isset($data['password'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $username = $data['username'];
    $password = $data['password'];
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        // Get user by username
        $stmt = $conn->prepare("SELECT id, username, email, password, tier, join_date FROM users WHERE username = ?");
        $stmt->execute([$username]);
        
        if ($stmt->rowCount() === 0) {
            returnError("Invalid username or password", 401);
            return;
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            returnError("Invalid username or password", 401);
            return;
        }
        
        // Remove password from response
        unset($user['password']);
        
        // Get user's saved programs
        $stmt = $conn->prepare("SELECT id, name, created, last_modified FROM programs WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $programs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $user['saved_programs'] = $programs;
        
        // Return success with user data
        returnSuccess($user);
        
    } catch(PDOException $e) {
        returnError("Login failed: " . $e->getMessage());
    }
}

// Update user information
function updateUser($data) {
    // Validate required fields
    if (!isset($data['id']) || !isset($data['token'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $user_id = $data['id'];
    $token = $data['token'];
    
    // Verify token (in a real implementation, use JWT or similar)
    if (!verifyToken($user_id, $token)) {
        returnError("Unauthorized", 401);
        return;
    }
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        $updates = [];
        $params = [$user_id];
        
        // Build update query based on provided fields
        if (isset($data['email'])) {
            $email = $data['email'];
            
            // Validate email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                returnError("Invalid email format", 400);
                return;
            }
            
            $updates[] = "email = ?";
            $params[] = $email;
        }
        
        if (isset($data['password'])) {
            $password = $data['password'];
            
            // Validate password
            if (strlen($password) < 8) {
                returnError("Password must be at least 8 characters", 400);
                return;
            }
            
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $updates[] = "password = ?";
            $params[] = $hashed_password;
        }
        
        // If no updates, return success
        if (empty($updates)) {
            returnSuccess(['message' => 'No changes made']);
            return;
        }
        
        // Update user
        $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        // Return success
        returnSuccess(['message' => 'User updated successfully']);
        
    } catch(PDOException $e) {
        returnError("Update failed: " . $e->getMessage());
    }
}

// Save a program
function saveProgram($data) {
    // Validate required fields
    if (!isset($data['user_id']) || !isset($data['token']) || !isset($data['name']) || !isset($data['code'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $user_id = $data['user_id'];
    $token = $data['token'];
    $name = $data['name'];
    $code = $data['code'];
    $program_id = isset($data['program_id']) ? $data['program_id'] : null;
    
    // Verify token
    if (!verifyToken($user_id, $token)) {
        returnError("Unauthorized", 401);
        return;
    }
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        // Check user's tier and program count limit
        $stmt = $conn->prepare("SELECT tier FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            returnError("User not found", 404);
            return;
        }
        
        // Get program count
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM programs WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Check if user has reached their limit (unless updating existing program)
        if (!$program_id) {
            $limit = 5; // Default for free tier
            
            if ($user['tier'] === 'basic') {
                $limit = 20;
            } else if ($user['tier'] === 'pro') {
                $limit = 1000; // Effectively unlimited
            }
            
            if ($count >= $limit) {
                returnError("You've reached your limit of $limit saved programs. Upgrade to save more!", 403);
                return;
            }
        }
        
        // Save or update program
        if ($program_id) {
            // Update existing program
            $stmt = $conn->prepare("UPDATE programs SET name = ?, code = ?, last_modified = NOW() WHERE id = ? AND user_id = ?");
            $stmt->execute([$name, $code, $program_id, $user_id]);
            
            if ($stmt->rowCount() === 0) {
                returnError("Program not found or you don't have permission to update it", 404);
                return;
            }
            
            $id = $program_id;
        } else {
            // Create new program
            $stmt = $conn->prepare("INSERT INTO programs (user_id, name, code, created, last_modified) VALUES (?, ?, ?, NOW(), NOW())");
            $stmt->execute([$user_id, $name, $code]);
            
            $id = $conn->lastInsertId();
        }
        
        // Return success with program ID
        returnSuccess([
            'id' => $id,
            'name' => $name,
            'created' => date('Y-m-d H:i:s'),
            'last_modified' => date('Y-m-d H:i:s')
        ]);
        
    } catch(PDOException $e) {
        returnError("Save program failed: " . $e->getMessage());
    }
}

// Get user's saved programs
function getPrograms() {
    // Validate required fields
    if (!isset($_GET['user_id']) || !isset($_GET['token'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $user_id = $_GET['user_id'];
    $token = $_GET['token'];
    
    // Verify token
    if (!verifyToken($user_id, $token)) {
        returnError("Unauthorized", 401);
        return;
    }
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        // Get programs
        $stmt = $conn->prepare("SELECT id, name, code, created, last_modified FROM programs WHERE user_id = ? ORDER BY last_modified DESC");
        $stmt->execute([$user_id]);
        $programs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Return success with programs
        returnSuccess(['programs' => $programs]);
        
    } catch(PDOException $e) {
        returnError("Get programs failed: " . $e->getMessage());
    }
}

// Delete a program
function deleteProgram($data) {
    // Validate required fields
    if (!isset($data['user_id']) || !isset($data['token']) || !isset($data['program_id'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $user_id = $data['user_id'];
    $token = $data['token'];
    $program_id = $data['program_id'];
    
    // Verify token
    if (!verifyToken($user_id, $token)) {
        returnError("Unauthorized", 401);
        return;
    }
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        // Delete program
        $stmt = $conn->prepare("DELETE FROM programs WHERE id = ? AND user_id = ?");
        $stmt->execute([$program_id, $user_id]);
        
        if ($stmt->rowCount() === 0) {
            returnError("Program not found or you don't have permission to delete it", 404);
            return;
        }
        
        // Return success
        returnSuccess(['message' => 'Program deleted successfully']);
        
    } catch(PDOException $e) {
        returnError("Delete program failed: " . $e->getMessage());
    }
}

// Upgrade user tier
function upgradeTier($data) {
    // Validate required fields
    if (!isset($data['user_id']) || !isset($data['token']) || !isset($data['tier'])) {
        returnError("Missing required fields", 400);
        return;
    }
    
    $user_id = $data['user_id'];
    $token = $data['token'];
    $tier = $data['tier'];
    
    // Verify token
    if (!verifyToken($user_id, $token)) {
        returnError("Unauthorized", 401);
        return;
    }
    
    // Validate tier
    if (!in_array($tier, ['free', 'basic', 'pro'])) {
        returnError("Invalid tier", 400);
        return;
    }
    
    // Connect to database
    $conn = connectDB();
    if (!$conn) return;
    
    try {
        // In a real implementation, handle payment processing here
        
        // Update user tier
        $stmt = $conn->prepare("UPDATE users SET tier = ? WHERE id = ?");
        $stmt->execute([$tier, $user_id]);
        
        // Return success
        returnSuccess([
            'message' => 'Tier upgraded successfully',
            'tier' => $tier
        ]);
        
    } catch(PDOException $e) {
        returnError("Upgrade failed: " . $e->getMessage());
    }
}

// Verify user token (simplified for demo)
// In a real implementation, use JWT or similar
function verifyToken($user_id, $token) {
    // For demo purposes, just check if token matches user_id
    // In production, use proper token validation
    return $token === "k2_token_" . $user_id;
}

// Return success response
function returnSuccess($data) {
    $response = [
        'success' => true,
        'data' => $data
    ];
    
    echo json_encode($response);
    exit();
}

// Return error response
function returnError($message, $code = 500) {
    http_response_code($code);
    
    $response = [
        'success' => false,
        'error' => [
            'message' => $message,
            'code' => $code
        ]
    ];
    
    echo json_encode($response);
    exit();
}
?>