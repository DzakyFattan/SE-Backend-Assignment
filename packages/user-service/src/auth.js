const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

// Middleware for user authentication
async function authenticateUser(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if password matches
    bcrypt.compare(password, user.rows[0].password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Add user object to request for further processing
      req.user = user.rows[0];
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// middleware for user authorization
async function authorizeUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { authenticateUser, authorizeUser };
