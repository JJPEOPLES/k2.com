// K2 Account System - Netlify Serverless Function
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB connection string - use environment variable in production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://k2user:k2password@cluster0.mongodb.net/k2accounts';
const JWT_SECRET = process.env.JWT_SECRET || 'k2_jwt_secret_key_change_in_production';

// Connect to MongoDB
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = client.db('k2accounts');
  cachedDb = db;
  return db;
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
    const db = await connectToDatabase();
    
    // Check if username or email already exists
    const existingUser = await db.collection('users').findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return returnError('Username or email already exists', 409);
    }
    
    // Hash password
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
    
    const result = await db.collection('users').insertOne(newUser);
    const userId = result.insertedId.toString();
    
    // Generate token
    const token = generateToken(userId);
    
    // Return user data (without password)
    const { password: _, ...userData } = newUser;
    userData.id = userId;
    userData.token = token;
    
    return returnSuccess(userData);
  } catch (error) {
    console.error('Registration error:', error);
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
    const db = await connectToDatabase();
    
    // Find user by username
    const user = await db.collection('users').findOne({ username });
    
    if (!user) {
      return returnError('Invalid username or password', 401);
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return returnError('Invalid username or password', 401);
    }
    
    // Update last login
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    // Get user's saved programs
    const programs = await db.collection('programs')
      .find({ userId: user._id.toString() })
      .project({ name: 1, created: 1, lastModified: 1 })
      .toArray();
    
    // Return user data (without password)
    const { password: _, ...userData } = user;
    userData.id = user._id.toString();
    userData.token = token;
    userData.saved_programs = programs.map(p => ({
      ...p,
      id: p._id.toString()
    }));
    
    return returnSuccess(userData);
  } catch (error) {
    console.error('Login error:', error);
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
    const db = await connectToDatabase();
    
    // Get user
    const user = await db.collection('users').findOne({ _id: user_id });
    
    if (!user) {
      return returnError('User not found', 404);
    }
    
    // Check program count limit for new programs
    if (!program_id) {
      const count = await db.collection('programs').countDocuments({ userId: user_id });
      
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
    
    const now = new Date();
    
    if (program_id) {
      // Update existing program
      const result = await db.collection('programs').updateOne(
        { _id: program_id, userId: user_id },
        {
          $set: {
            name,
            code,
            lastModified: now
          }
        }
      );
      
      if (result.matchedCount === 0) {
        return returnError('Program not found or you don\'t have permission to update it', 404);
      }
      
      return returnSuccess({
        id: program_id,
        name,
        created: now,
        lastModified: now
      });
    } else {
      // Create new program
      const newProgram = {
        userId: user_id,
        name,
        code,
        created: now,
        lastModified: now
      };
      
      const result = await db.collection('programs').insertOne(newProgram);
      
      return returnSuccess({
        id: result.insertedId.toString(),
        name,
        created: now,
        lastModified: now
      });
    }
  } catch (error) {
    console.error('Save program error:', error);
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
    const db = await connectToDatabase();
    
    // Get programs
    const programs = await db.collection('programs')
      .find({ userId: user_id })
      .sort({ lastModified: -1 })
      .toArray();
    
    // Format programs
    const formattedPrograms = programs.map(p => ({
      id: p._id.toString(),
      name: p.name,
      code: p.code,
      created: p.created,
      lastModified: p.lastModified
    }));
    
    return returnSuccess({ programs: formattedPrograms });
  } catch (error) {
    console.error('Get programs error:', error);
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
    const db = await connectToDatabase();
    
    // Delete program
    const result = await db.collection('programs').deleteOne({
      _id: program_id,
      userId: user_id
    });
    
    if (result.deletedCount === 0) {
      return returnError('Program not found or you don\'t have permission to delete it', 404);
    }
    
    return returnSuccess({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
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
    const db = await connectToDatabase();
    
    // In a real implementation, handle payment processing here
    
    // Update user tier
    await db.collection('users').updateOne(
      { _id: user_id },
      { $set: { tier } }
    );
    
    return returnSuccess({
      message: 'Tier upgraded successfully',
      tier
    });
  } catch (error) {
    console.error('Upgrade error:', error);
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