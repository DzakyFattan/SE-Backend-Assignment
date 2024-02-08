const { Router } = require("express");

const { registerUser, loginUser } = require("./controller");
const authenticateUser = require("./auth");
const sanitizeUserInput = require("./sanitize");

const router = Router();

// Register route
router.post("/register", registerUser(req, res));

// Login route
router.post("/login", authenticateUser, loginUser(req, res));

// Example protected route
router.get("/profile", authenticateUser, (req, res) => {
  // Authenticated user can access this route
  res.json({ message: `Welcome ${req.user.username}!` });
});

module.exports = router;
