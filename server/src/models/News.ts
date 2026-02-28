import mongoose from "mongoose";

// Admin replies for forum posts
const ReplySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
    type: { type: String, enum: ["news", "forum"], default: "news" },
    adminReplies: [ReplySchema], // only for forum posts
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);