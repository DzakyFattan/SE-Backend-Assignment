// Middleware for sanitizing user input
function sanitizeUserInput(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  // Sanitize username (for example, trim whitespace)
  req.body.username = username.trim();
  next();
}

module.exports = sanitizeUserInput;
