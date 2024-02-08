const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

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
      { user_id: req.user.user_id, username: req.user.username },
      process.env.SECRET_KEY
    );
    res.status(200).json({ message: "Login successful", accessToken: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password, phone_number, address } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    // if field is empty, use the old value
    const newUsername = username ? username : user.rows[0].username;
    const newPhoneNumber = phone_number
      ? phone_number
      : user.rows[0].phone_number;
    const newAddress = address ? address : user.rows[0].address;

    // if password is empty, use the old value
    if (!password) {
      pool.query(
        "UPDATE users SET username = $1, phone_number = $2, address = $3 WHERE email = $4",
        [newUsername, newPhoneNumber, newAddress, email],
        (error, results) => {
          if (error) {
            return res.status(500).json({ message: "Error updating user" });
          }
          res.status(200).json({ message: "User updated successfully" });
        }
      );
    }
    // Hash password before saving
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Error hashing password" });
      }
      pool.query(
        "UPDATE users SET username = $1, password = $2, phone_number = $3, address = $4 WHERE email = $5",
        [newUsername, hash, newPhoneNumber, newAddress, email],
        (error, results) => {
          if (error) {
            return res.status(500).json({ message: "Error updating user" });
          }
          res.status(200).json({ message: "User updated successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    pool.query(
      "DELETE FROM users WHERE email = $1",
      [email],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: "Error deleting user" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };
