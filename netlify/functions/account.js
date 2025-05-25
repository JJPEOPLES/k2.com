// K2 Account System - Netlify Serverless Function
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// SQLite database path
const DB_PATH = process.env.DB_PATH || path.join('/tmp', 'k2accounts.db');
const JWT_SECRET = process.env.JWT_SECRET || 'k2_jwt_secret_key_change_in_production';

// Flag to indicate if we should use localStorage fallback
const USE_LOCALSTORAGE_FALLBACK = false; // Set to false since we're using SQLite

// Connect to SQLite database
let cachedDb = null;
function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  try {
    // Ensure the directory exists
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Connect to SQLite database
    const db = new Database(DB_PATH);
    
    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        tier TEXT DEFAULT 'free',
        joinDate TEXT NOT NULL,
        lastLogin TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        created TEXT NOT NULL,
        lastModified TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);
    
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('SQLite connection error:', error);
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to SQLite connection error');
      return null;
    }
    throw error;
  }
}

// Helper function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Helper function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Helper function to return success response
function returnSuccess(data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: true,
      data
    })
  };
}

// Helper function to return error response
function returnError(message, statusCode = 500) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: false,
      error: {
        message,
        code: statusCode
      }
    })
  };
}

// Register a new user
async function registerUser(data) {
  if (!data.username || !data.email || !data.password) {
    return returnError('Missing required fields', 400);
  }
  
  const { username, email, password } = data;
  
  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return returnError('Invalid email format', 400);
  }
  
  // Validate username (alphanumeric, 3-20 chars)
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return returnError('Username must be 3-20 characters and contain only letters, numbers, and underscores', 400);
  }
  
  // Validate password (at least 8 chars)
  if (password.length < 8) {
    return returnError('Password must be at least 8 characters', 400);
  }
  
  try {
    const db = connectToDatabase();
    
    // If db is null, use localStorage fallback
    if (!db && USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback for registration');
      
      // Generate a simple user ID
      const userId = Date.now().toString();
      
      // Hash password (still hash it for security)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = {
        username,
        email,
        password: hashedPassword,
        tier: 'free',
        joinDate: new Date(),
        lastLogin: new Date()
      };
      
      // Generate token
      const token = generateToken(userId);
      
      // Return user data (without password)
      const { password: _, ...userData } = newUser;
      userData.id = userId;
      userData.token = token;
      userData.saved_programs = [];
      
      return returnSuccess(userData);
    }
    
    // Check if username or email already exists
    const checkStmt = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?');
    const existingUser = checkStmt.get(username, email);
    
    if (existingUser) {
      return returnError('Username or email already exists', 409);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const now = new Date().toISOString();
    
    // Create new user
    const insertStmt = db.prepare(
      'INSERT INTO users (username, email, password, tier, joinDate, lastLogin) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    const result = insertStmt.run(username, email, hashedPassword, 'free', now, now);
    const userId = result.lastInsertRowid.toString();
    
    // Generate token
    const token = generateToken(userId);
    
    // Return user data
    const userData = {
      id: userId,
      username,
      email,
      tier: 'free',
      joinDate: now,
      lastLogin: now,
      token,
      saved_programs: []
    };
    
    return returnSuccess(userData);
  } catch (error) {
    console.error('Registration error:', error);
    
    // If there's an error and we're using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to registration error');
      
      // Generate a simple user ID
      const userId = Date.now().toString();
      
      // Create new user (simplified for fallback)
      const userData = {
        id: userId,
        username,
        email,
        tier: 'free',
        joinDate: new Date().toISOString(),
        token: generateToken(userId),
        saved_programs: []
      };
      
      return returnSuccess(userData);
    }
    
    return returnError('Registration failed: ' + error.message);
  }
}

// Login a user
async function loginUser(data) {
  if (!data.username || !data.password) {
    return returnError('Missing required fields', 400);
  }
  
  const { username, password } = data;
  
  try {
    const db = connectToDatabase();
    
    // If db is null, use localStorage fallback
    if (!db && USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback for login');
      
      // For fallback, we'll simulate a successful login
      // In a real implementation, you might want to check against a hardcoded list of users
      // or return an error asking users to try again later
      
      // Generate a simple user ID
      const userId = Date.now().toString();
      
      // Create user data
      const userData = {
        id: userId,
        username,
        email: username + '@example.com', // Simulated email
        tier: 'free',
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        token: generateToken(userId),
        saved_programs: []
      };
      
      return returnSuccess(userData);
    }
    
    // Find user by username
    const getUserStmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = getUserStmt.get(username);
    
    if (!user) {
      return returnError('Invalid username or password', 401);
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return returnError('Invalid username or password', 401);
    }
    
    // Update last login
    const now = new Date().toISOString();
    const updateLoginStmt = db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?');
    updateLoginStmt.run(now, user.id);
    
    // Generate token
    const token = generateToken(user.id.toString());
    
    // Get user's saved programs
    const getProgramsStmt = db.prepare('SELECT id, name, created, lastModified FROM programs WHERE userId = ? ORDER BY lastModified DESC');
    const programs = getProgramsStmt.all(user.id);
    
    // Return user data (without password)
    const userData = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      tier: user.tier,
      joinDate: user.joinDate,
      lastLogin: now,
      token,
      saved_programs: programs
    };
    
    return returnSuccess(userData);
  } catch (error) {
    console.error('Login error:', error);
    
    // If there's an error and we're using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to login error');
      
      // Generate a simple user ID
      const userId = Date.now().toString();
      
      // Create user data
      const userData = {
        id: userId,
        username,
        email: username + '@example.com', // Simulated email
        tier: 'free',
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        token: generateToken(userId),
        saved_programs: []
      };
      
      return returnSuccess(userData);
    }
    
    return returnError('Login failed: ' + error.message);
  }
}

// Save a program
async function saveProgram(data) {
  if (!data.user_id || !data.token || !data.name || !data.code) {
    return returnError('Missing required fields', 400);
  }
  
  const { user_id, token, name, code, program_id } = data;
  
  // Verify token
  const decoded = verifyToken(token);
  if (!decoded || decoded.userId !== user_id) {
    return returnError('Unauthorized', 401);
  }
  
  try {
    const db = connectToDatabase();
    
    // If db is null, use localStorage fallback
    if (!db && USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback for saving program');
      
      const now = new Date().toISOString();
      const programId = program_id || Date.now().toString();
      
      return returnSuccess({
        id: programId,
        name,
        created: now,
        lastModified: now
      });
    }
    
    // Get user
    const getUserStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = getUserStmt.get(user_id);
    
    if (!user) {
      return returnError('User not found', 404);
    }
    
    // Check program count limit for new programs
    if (!program_id) {
      const countStmt = db.prepare('SELECT COUNT(*) as count FROM programs WHERE userId = ?');
      const { count } = countStmt.get(user_id);
      
      let limit = 5; // Default for free tier
      
      if (user.tier === 'basic') {
        limit = 20;
      } else if (user.tier === 'pro') {
        limit = 1000; // Effectively unlimited
      }
      
      if (count >= limit) {
        return returnError(`You've reached your limit of ${limit} saved programs. Upgrade to save more!`, 403);
      }
    }
    
    const now = new Date().toISOString();
    
    if (program_id) {
      // Update existing program
      const updateStmt = db.prepare(
        'UPDATE programs SET name = ?, code = ?, lastModified = ? WHERE id = ? AND userId = ?'
      );
      const result = updateStmt.run(name, code, now, program_id, user_id);
      
      if (result.changes === 0) {
        return returnError('Program not found or you don\'t have permission to update it', 404);
      }
      
      // Get created date
      const getCreatedStmt = db.prepare('SELECT created FROM programs WHERE id = ?');
      const { created } = getCreatedStmt.get(program_id);
      
      return returnSuccess({
        id: program_id,
        name,
        created,
        lastModified: now
      });
    } else {
      // Create new program
      const insertStmt = db.prepare(
        'INSERT INTO programs (userId, name, code, created, lastModified) VALUES (?, ?, ?, ?, ?)'
      );
      const result = insertStmt.run(user_id, name, code, now, now);
      
      return returnSuccess({
        id: result.lastInsertRowid.toString(),
        name,
        created: now,
        lastModified: now
      });
    }
  } catch (error) {
    console.error('Save program error:', error);
    
    // If there's an error and we're using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to save program error');
      
      const now = new Date().toISOString();
      const programId = program_id || Date.now().toString();
      
      return returnSuccess({
        id: programId,
        name,
        created: now,
        lastModified: now
      });
    }
    
    return returnError('Save program failed: ' + error.message);
  }
}

// Get user's saved programs
async function getPrograms(data) {
  if (!data.user_id || !data.token) {
    return returnError('Missing required fields', 400);
  }
  
  const { user_id, token } = data;
  
  // Verify token
  const decoded = verifyToken(token);
  if (!decoded || decoded.userId !== user_id) {
    return returnError('Unauthorized', 401);
  }
  
  try {
    const db = connectToDatabase();
    
    // If db is null, use localStorage fallback
    if (!db && USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback for getting programs');
      
      // Return empty programs array for fallback
      // The actual programs will be managed by the client-side localStorage
      return returnSuccess({ programs: [] });
    }
    
    // Get programs
    const getProgramsStmt = db.prepare(
      'SELECT id, name, code, created, lastModified FROM programs WHERE userId = ? ORDER BY lastModified DESC'
    );
    const programs = getProgramsStmt.all(user_id);
    
    // Format programs (ensure id is a string)
    const formattedPrograms = programs.map(p => ({
      ...p,
      id: p.id.toString()
    }));
    
    return returnSuccess({ programs: formattedPrograms });
  } catch (error) {
    console.error('Get programs error:', error);
    
    // If there's an error and we're using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to get programs error');
      
      // Return empty programs array for fallback
      return returnSuccess({ programs: [] });
    }
    
    return returnError('Get programs failed: ' + error.message);
  }
}

// Delete a program
async function deleteProgram(data) {
  if (!data.user_id || !data.token || !data.program_id) {
    return returnError('Missing required fields', 400);
  }
  
  const { user_id, token, program_id } = data;
  
  // Verify token
  const decoded = verifyToken(token);
  if (!decoded || decoded.userId !== user_id) {
    return returnError('Unauthorized', 401);
  }
  
  try {
    const db = connectToDatabase();
    
    // If db is null, use localStorage fallback
    if (!db && USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback for deleting program');
      
      // For fallback, just return success
      // The actual deletion will be handled by the client-side localStorage
      return returnSuccess({ message: 'Program deleted successfully' });
    }
    
    // Delete program
    const deleteStmt = db.prepare('DELETE FROM programs WHERE id = ? AND userId = ?');
    const result = deleteStmt.run(program_id, user_id);
    
    if (result.changes === 0) {
      return returnError('Program not found or you don\'t have permission to delete it', 404);
    }
    
    return returnSuccess({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    
    // If there's an error and we're using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to delete program error');
      
      // For fallback, just return success
      return returnSuccess({ message: 'Program deleted successfully' });
    }
    
    return returnError('Delete program failed: ' + error.message);
  }
}

// Upgrade user tier
async function upgradeTier(data) {
  if (!data.user_id || !data.token || !data.tier) {
    return returnError('Missing required fields', 400);
  }
  
  const { user_id, token, tier } = data;
  
  // Verify token
  const decoded = verifyToken(token);
  if (!decoded || decoded.userId !== user_id) {
    return returnError('Unauthorized', 401);
  }
  
  // Validate tier
  if (!['free', 'basic', 'pro'].includes(tier)) {
    return returnError('Invalid tier', 400);
  }
  
  try {
    const db = connectToDatabase();
    
    // If db is null, use localStorage fallback
    if (!db && USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback for upgrading tier');
      
      // For fallback, just return success
      // The actual tier upgrade will be handled by the client-side localStorage
      return returnSuccess({
        message: 'Tier upgraded successfully',
        tier
      });
    }
    
    // In a real implementation, handle payment processing here
    
    // Update user tier
    const updateTierStmt = db.prepare('UPDATE users SET tier = ? WHERE id = ?');
    updateTierStmt.run(tier, user_id);
    
    return returnSuccess({
      message: 'Tier upgraded successfully',
      tier
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    
    // If there's an error and we're using localStorage fallback
    if (USE_LOCALSTORAGE_FALLBACK) {
      console.log('Using localStorage fallback due to upgrade tier error');
      
      // For fallback, just return success
      return returnSuccess({
        message: 'Tier upgraded successfully',
        tier
      });
    }
    
    return returnError('Upgrade failed: ' + error.message);
  }
}

// Main handler function
exports.handler = async (event, context) => {
  // For preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }
  
  // Get action from query parameters
  const params = new URLSearchParams(event.queryStringParameters || {});
  const action = params.get('action');
  
  // Parse request body
  let data = {};
  if (event.body) {
    try {
      data = JSON.parse(event.body);
    } catch (error) {
      return returnError('Invalid JSON in request body', 400);
    }
  }
  
  // For GET requests, merge query parameters into data
  if (event.httpMethod === 'GET') {
    for (const [key, value] of Object.entries(event.queryStringParameters || {})) {
      if (key !== 'action') {
        data[key] = value;
      }
    }
  }
  
  // Route the request based on action
  switch (action) {
    case 'register':
      if (event.httpMethod === 'POST') {
        return await registerUser(data);
      }
      return returnError('Method not allowed', 405);
      
    case 'login':
      if (event.httpMethod === 'POST') {
        return await loginUser(data);
      }
      return returnError('Method not allowed', 405);
      
    case 'save_program':
      if (event.httpMethod === 'POST') {
        return await saveProgram(data);
      }
      return returnError('Method not allowed', 405);
      
    case 'get_programs':
      if (event.httpMethod === 'GET') {
        return await getPrograms(data);
      }
      return returnError('Method not allowed', 405);
      
    case 'delete_program':
      if (event.httpMethod === 'DELETE') {
        return await deleteProgram(data);
      }
      return returnError('Method not allowed', 405);
      
    case 'upgrade':
      if (event.httpMethod === 'PUT') {
        return await upgradeTier(data);
      }
      return returnError('Method not allowed', 405);
      
    default:
      return returnError('Invalid action', 400);
  }
};