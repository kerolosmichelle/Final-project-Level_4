// Import packages we need
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";

// Get current file and directory paths (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();

// Allow requests from other websites (CORS)
app.use(cors());

// Parse incoming JSON data in request bodies
app.use(express.json());

// Serve the built React app (run "npm run build" first)
const clientDist = path.join(__dirname, "client", "dist");
app.use(express.static(clientDist));

// Set up authentication routes (login, register)
app.use("/api/auth", authRoutes);

// Set up station routes (get stations, announcements, etc.)
app.use("/api/stations", stationRoutes);

// Health check endpoint to test if server is running
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Any other page: send the React app so the router can handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

// Error handler - catches any errors and sends response
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
