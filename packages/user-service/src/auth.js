const bcrypt = require("bcrypt");

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
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Add user object to request for further processing
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = authenticateUser;
