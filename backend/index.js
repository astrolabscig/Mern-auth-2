import 'dotenv/config'; // First - loads .env before any process.env access
import express from "express";
import { connectDB } from "./db/connectDB.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// CORS: CLIENT_URL should be set in .env for dev and hosting dashboard for production
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Connect to DB first, then start listening.
// This ensures requests are not accepted before the DB is ready.
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
};

startServer();
