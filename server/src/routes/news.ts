import express from "express";
import News from "../models/News.js";

const router = express.Router();

// 🔓 GET all posts (news + forums)
router.get("/", async (req, res) => {
  try {
    const allPosts = await News.find().sort({ createdAt: -1 });
    res.json(allPosts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts." });
  }
});

// 🔐 POST create news (Admin)
router.post("/", async (req, res) => {
  const { title, content, author, type } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing fields" });

  try {
    const newPost = await News.create({
      title,
      content,
      author: author || "Admin",
      type: type || "news",
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post." });
  }
});

// 🔓 POST create forum (User)
router.post("/forum", async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing fields" });

  try {
    const forumPost = await News.create({
      title,
      content,
      author: author || "User",
      type: "forum",
    });
    res.status(201).json(forumPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create forum post." });
  }
});

// 🔐 POST admin reply to forum
router.post("/:id/reply", async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Reply required" });

  try {
    const post = await News.findById(req.params.id);
    if (!post || post.type !== "forum") return res.status(404).json({ message: "Forum post not found" });

    post.adminReplies.push({ content });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to reply" });
  }
});

// 🔐 DELETE post (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
});

export default router;