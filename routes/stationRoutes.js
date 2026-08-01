import express from "express";
import Station from "../models/Station.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    const stations = await Station.find().select("-__v");
    res.json({ stations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load stations" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).select("-__v");
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json({ station });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load station" });
  }
});

router.post("/", authMiddleware, requireAdmin, async (req, res) => {
  const { name, location, announcements } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Station name is required" });
  }

  try {
    const station = await Station.create({ name, location, announcements });
    res.status(201).json({ station });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create station" });
  }
});

router.post("/:id/announcements", authMiddleware, requireAdmin, async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Announcement message is required" });
  }

  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    station.announcements.push({ message });
    await station.save();
    res.status(201).json({ station });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add announcement" });
  }
});

export default router;
