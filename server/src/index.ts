import express from "express";
import dotenv from "dotenv";
import type { Express } from "express";
import mongoose from "mongoose";
import comelecRecordRouter from './routes/comelec-records.js';
import cors from 'cors';
import dialogflowRouter from "./routes/dialogflow.js"; // your CES route
import newsRouter from "./routes/news.js";
import verifyRouter from "./routes/verify.js"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// ===== CORS setup =====
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parse JSON
app.use(express.json());

// Routes
app.use("/api/dialogflow", dialogflowRouter);
app.use("/comelec-records", comelecRecordRouter);
app.use("/api/news", newsRouter);
app.use("/api/verify", verifyRouter);
// MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  throw new Error("MONGO_URI not defined in .env");
}

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
