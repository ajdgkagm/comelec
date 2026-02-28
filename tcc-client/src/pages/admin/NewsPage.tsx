import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import "./NewsPage.css";

interface NewsPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  adminReplies?: { _id: string; content: string; createdAt: string }[];
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [forumTitle, setForumTitle] = useState("");
  const [forumContent, setForumContent] = useState("");

  useEffect(() => {
    fetchNews();
    fetchForumPosts();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/api/news`);
      setNews(res.data.filter((n: any) => n.type !== "forum"));
    } catch (err) {
      console.error("Failed to fetch news:", err);
    }
  };

  const fetchForumPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BACKEND_URL}/api/news`);
      setForumPosts(res.data.filter((f: any) => f.type === "forum"));
    } catch (err) {
      console.error("Failed to fetch forum posts:", err);
    }
  };

  const handleForumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forumTitle || !forumContent) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BACKEND_URL}/api/news/forum`, {
        title: forumTitle,
        content: forumContent,
        author: "User",
      });
      setForumTitle("");
      setForumContent("");
      fetchForumPosts();
    } catch (err) {
      console.error("Failed to post forum:", err);
    }
  };

  const hasNews = news.length > 0;
  const featured = news[0];
  const others = news.slice(1);

  // Placeholder cards if no news
  const placeholderCards = Array.from({ length: 3 }).map((_, i) => ({
    _id: `placeholder-${i}`,
    title: "No News Available",
    content:
      "There are currently no news articles or announcements. Please check back later for the latest updates from COMELEC.",
    createdAt: new Date().toISOString(),
  }));

  return (
    <div>
      <Header />
      <div className="news-wrapper">
        <h1 className="news-main-title">COMELEC News & Announcements</h1>

        {/* FEATURED ARTICLE */}
        <div className="featured-article card">
          {hasNews ? (
            <>
              <h2 className="featured-title">{featured.title}</h2>
              <div className="meta">
                By <strong>{featured.author}</strong> • {new Date(featured.createdAt).toLocaleDateString()}
              </div>
              <p className="featured-content">{featured.content}</p>
            </>
          ) : (
            <>
              <h2 className="featured-title">No News Available</h2>
              <div className="meta">COMELEC • {new Date().toLocaleDateString()}</div>
              <p className="featured-content">
                There are currently no news articles or announcements. Please check back later for updates.
              </p>
            </>
          )}
        </div>

        {/* OTHER ARTICLES */}
        <div className="article-grid">
          {(hasNews ? others : placeholderCards).map((post) => (
            <div key={post._id} className="article-card card">
              <h3 className="article-title">{post.title}</h3>
              <div className="meta">{new Date(post.createdAt).toLocaleDateString()}</div>
              <p className="excerpt">{post.content.substring(0, 150)}...</p>
            </div>
          ))}
        </div>

        {/* FORUM SECTION */}
        <div className="forum-section">
          <h2 className="section-title">Inquiry</h2>

          {/* Forum Form */}
          <form onSubmit={handleForumSubmit} className="forum-form card">
            <input
              type="text"
              placeholder="Forum Title"
              value={forumTitle}
              onChange={(e) => setForumTitle(e.target.value)}
              required
              className="forum-input"
            />
            <textarea
              placeholder="Your forum post..."
              value={forumContent}
              onChange={(e) => setForumContent(e.target.value)}
              required
              className="forum-textarea"
            />
            <button type="submit" className="btn-submit">
              Post to Forum
            </button>
          </form>

          {/* Forum Posts */}
          <div className="forum-posts">
            {forumPosts.length === 0 && <p className="no-forum">No forum posts yet.</p>}
            {forumPosts.map((post) => (
              <div key={post._id} className="forum-card card">
                <h3 className="forum-title">{post.title}</h3>
                <p className="forum-content">{post.content}</p>
                <p className="forum-meta">
                  <i>
                    By {post.author} on {new Date(post.createdAt).toLocaleString()}
                  </i>
                </p>

                {post.adminReplies?.map((r) => (
                  <p key={r._id} className="admin-reply">
                    <strong>Admin Reply:</strong> {r.content}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}