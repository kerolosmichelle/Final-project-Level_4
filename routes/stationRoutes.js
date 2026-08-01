import express from "express";

const router = express.Router();

// Get list of stations (placeholder)
router.get("/", (req, res) => {
  res.status(501).json({ message: "Station list endpoint not implemented yet" });
});

// Get single station by id (placeholder)
router.get("/:id", (req, res) => {
  res.status(501).json({ message: "Station detail endpoint not implemented yet" });
});

export default router;
