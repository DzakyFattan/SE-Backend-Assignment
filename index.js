const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Sample user data (normally this would be stored in a database)
const users = [];

// Middleware for JSON body parsing
app.use(bodyParser.json());

// Middleware for sanitizing user input
function sanitizeUserInput(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  // Sanitize username (for example, trim whitespace)
  req.body.username = username.trim();
  next();
}

// Middleware for user authentication
function authenticateUser(req, res, next) {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  // Check if password matches
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Add user object to request for further processing
    req.user = user;
    next();
  });
}

// Register route
app.post('/register', sanitizeUserInput, (req, res) => {
  const { username, password } = req.body;
  // Hash password before saving (in a real app, you'd want to use async/await)
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password" });
    }
    users.push({ username, password: hash });
    res.status(201).json({ message: "User registered successfully" });
  });
});

// Login route
app.post('/login', sanitizeUserInput, authenticateUser, (req, res) => {
  // Generate JWT token
  const token = jwt.sign({ username: req.user.username }, 'secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// Example protected route
app.get('/profile', authenticateUser, (req, res) => {
  // Authenticated user can access this route
  res.json({ message: `Welcome ${req.user.username}!` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
