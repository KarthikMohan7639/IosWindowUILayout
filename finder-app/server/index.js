const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ─────────────────────────────────────
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/finder-app";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => console.error("❌  MongoDB connection error:", err.message));

// ── API Routes ─────────────────────────────────────────────
// Health-check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// TODO: Add more API routes here
// e.g. app.use("/api/files", require("./routes/files"));

// ── Serve React Client in Production ───────────────────────
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));

  // All remaining requests → React index.html (client-side routing)
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
