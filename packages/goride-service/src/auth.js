const jwt = require("jsonwebtoken");

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

module.exports = authorizeUser;
