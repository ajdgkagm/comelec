import express from "express";
import News from "../models/News.js";

const router = express.Router();

// 🔓 PUBLIC — Get all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch news." });
  }
});

// 🔐 ADMIN ONLY — Create news
router.post("/", async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Missing fields." });
  }

  try {
    const newPost = await News.create({
      title,
      content,
      author: author || "Admin",
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post." });
  }
});

// 🔐 ADMIN ONLY — Delete news by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news." });
  }
});

export default router;