import express from "express";

const router = express.Router();

// Register a new user (placeholder)
router.post("/register", (req, res) => {
  res.status(501).json({ message: "Register endpoint not implemented yet" });
});

// Login user (placeholder)
router.post("/login", (req, res) => {
  res.status(501).json({ message: "Login endpoint not implemented yet" });
});

export default router;
