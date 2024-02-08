// Middleware for user authentication
function authenticateUser(req, res, next) {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
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

module.exports = authenticateUser;
