const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs"); // You'll need to install yamljs: npm install yamljs

const sanitizeUserInput = require("./middleware/sanitize");
const authenticateUser = require("./middleware/auth");

const app = express();
const PORT = 2431;

// Sample user data (normally this would be stored in a database)
const users = [];

// Middleware for JSON body parsing
app.use(bodyParser.json());

// Register route
app.post("/register", sanitizeUserInput, (req, res) => {
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
app.post("/login", sanitizeUserInput, authenticateUser, (req, res) => {
  // Generate JWT token
  const token = jwt.sign({ username: req.user.username }, "secret_key", {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Example protected route
app.get("/profile", authenticateUser, (req, res) => {
  // Authenticated user can access this route
  res.json({ message: `Welcome ${req.user.username}!` });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
