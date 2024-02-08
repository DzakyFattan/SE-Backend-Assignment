const { Router } = require("express");

const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("./controller");
const { authenticateUser, authorizeUser } = require("./auth");

const router = Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", authenticateUser, loginUser);

// Update route
router.put("/update", updateUser);

// Delete route
router.delete("/delete", deleteUser);

// Example protected route
router.get("/profile", authorizeUser, (req, res) => {
  // Authenticated user can access this route
  res.json({ message: `Welcome ${req.user.username}!` });
});

module.exports = router;
