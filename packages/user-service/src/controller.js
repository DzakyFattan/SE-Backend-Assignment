const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone_number, address } = req.body;
    // check email
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password before saving
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }
      pool.query(
        "INSERT INTO users (username, email, password, phone_number, address) VALUES ($1, $2, $3, $4, $5)",
        [username, email, hash, phone_number, address],
        (error, results) => {
          if (error) {
            return res.status(500).json({ message: "Error registering user" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { username: req.user.username },
      process.env.SECRET_KEY
    );
    res.status(200).json({ message: "Login successful", accessToken: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser };
