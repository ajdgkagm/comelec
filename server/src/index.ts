import express from "express";
import dotenv from "dotenv";
import type { Express } from "express";
import mongoose from "mongoose";
import comelecRecordRouter from './routes/comelec-records.js';
import cors from 'cors';
import dialogflowRouter from "./routes/dialogflow.js";
import newsRouter from "./routes/news.js";
import verifyRouter from "./routes/verify.js";

// Load .env
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// ===== CORS setup =====
app.use(cors({
  // origin: "http://localhost:5173",
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parse JSON
app.use(express.json());

// ===== Routes =====
app.use("/api/dialogflow", dialogflowRouter);
app.use("/comelec-records", comelecRecordRouter);
app.use("/api/news", newsRouter);
app.use("/api/verify", verifyRouter);

// ===== MongoDB Connection =====
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MONGO_URI not defined in .env");
}

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// ===== Google Service Account =====
let googleServiceAccount: any;
if (process.env.GOOGLE_SERVICE_ACCOUNT) {
  try {
    googleServiceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT", err);
  }
} else {
  console.warn("GOOGLE_SERVICE_ACCOUNT not defined in .env");
}

// Example usage with Google SDK (optional):
// import { initializeApp, cert } from "firebase-admin/app";
// initializeApp({ credential: cert(googleServiceAccount) });

// ===== OpenAI =====
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.warn("OPENAI_API_KEY not defined in .env");
}

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});