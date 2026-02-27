import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminNews.css";

interface NewsPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function AdminNews() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all Admin news
  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/news");
      const adminNews = res.data.filter((post: NewsPost) => post.author === "Admin");
      setNews(adminNews);
    } catch (err) {
      console.error("Failed to fetch news:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle new news submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/api/news", {
        title,
        content,
        author: "Admin",
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

      setTitle("");
      setContent("");
      fetchNews();
    } catch (err) {
      console.error("Failed to create news:", err);
    }
  };

  // Open modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Delete news
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:3001/api/news/${deleteId}`);
      fetchNews();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete news:", err);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {submitted && <div className="success-alert">📰 News Posted Successfully!</div>}

        {/* FORM */}
        <div className="form-card">
          <h2 className="form-title">Create News Article</h2>
          <p className="form-desc">Commission on Elections – Official News Management</p>

          <form onSubmit={handleSubmit} className="animated-form">
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

            <button type="submit" className="btn-submit">Publish Article</button>
          </form>
        </div>

        {/* NEWS LIST */}
        <div className="news-list">
          <h2 className="form-title" style={{ marginTop: "40px" }}>
            Your News Articles
          </h2>
          {news.length === 0 ? (
            <p>No news posted yet.</p>
          ) : (
            news.map((post) => (
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
            ))
          )}
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this news article?</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={cancelDelete}>
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