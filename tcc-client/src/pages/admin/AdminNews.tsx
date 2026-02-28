import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminNews.css";

interface Reply {
  _id: string;
  content: string;
  createdAt: string;
}

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  adminReplies?: Reply[];
}

interface NewsPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function AdminNews() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/api/news`);
      setNews(res.data.filter((p: any) => p.type === "news" && p.author === "Admin"));
      setForumPosts(res.data.filter((p: any) => p.type === "forum"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create News
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/api/news`, {
        title,
        content,
        author: "Admin",
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin reply
  const handleReply = async (forumId: string) => {
    if (!replyInput[forumId]) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/api/news/${forumId}/reply`, {
        content: replyInput[forumId],
      });
      setReplyInput((prev) => ({ ...prev, [forumId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete with confirmation
  const confirmDelete = (id: string) => {
    setDeleteTarget(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BACKEND_URL}/api/news/${deleteTarget}`);
      setModalOpen(false);
      setDeleteTarget(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {submitted && <div className="success-alert">📰 News Posted Successfully!</div>}

        {/* CREATE NEWS */}
        <div className="form-card">
          <h2 className="form-title">Create News Article</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>News Title</label>
            </div>
            <div className="input-field textarea-field">
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
              <label>News Content</label>
            </div>
            <button type="submit" className="btn-submit">
              Publish Article
            </button>
          </form>
        </div>

        {/* NEWS LIST */}
        <div className="news-list">
          <h2 className="form-title">Official News</h2>
          {news.map((post) => (
            <div key={post._id} className="news-card">
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 200)}...</p>
              <div className="news-meta">
                <small>{new Date(post.createdAt).toLocaleString()}</small>
                <button className="btn-delete" onClick={() => confirmDelete(post._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FORUM POSTS */}
        <div className="news-list">
          <h2 className="form-title">User Forum Posts</h2>
          {forumPosts.length === 0 && <p>No forum posts yet.</p>}
          {forumPosts.map((post) => (
            <div key={post._id} className="news-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>
                <i>
                  By {post.author} on {new Date(post.createdAt).toLocaleString()}
                </i>
              </p>
              <div className="news-meta">
                <button className="btn-delete" onClick={() => confirmDelete(post._id)}>
                  Delete
                </button>
              </div>

              {/* Admin Replies */}
              {post.adminReplies?.map((r) => (
                <p key={r._id} className="admin-reply">
                  <strong>Admin Reply:</strong> {r.content}
                </p>
              ))}

              {/* Reply Form */}
              {!post.adminReplies?.length && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReply(post._id);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Reply to this forum post..."
                    value={replyInput[post._id] || ""}
                    onChange={(e) =>
                      setReplyInput((prev) => ({ ...prev, [post._id]: e.target.value }))
                    }
                    required
                  />
                  <button type="submit" className="btn-submit">
                    Reply
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Are you sure you want to delete this post?</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}