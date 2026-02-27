import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import "./NewsPage.css"
interface NewsPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await axios.get("http://localhost:3001/api/news");
    setNews(res.data);
  };

  if (news.length === 0) {
    return (
      <div className="news-container">
        
        <h2>Latest News</h2>
        <p>No news available.</p>
      </div>
    );
  }

  const featured = news[0];
  const others = news.slice(1);

  return (
    <div>
    <Header />
    <div className="news-wrapper">
      <h1 className="news-main-title">COMELEC News & Announcements</h1>

      {/* FEATURED ARTICLE */}
      <div className="featured-article">
        <h2>{featured.title}</h2>
        <div className="meta">
          By {featured.author} •{" "}
          {new Date(featured.createdAt).toLocaleDateString()}
        </div>
        <p className="featured-content">{featured.content}</p>
      </div>

      {/* OTHER ARTICLES */}
      <div className="article-grid">
        {others.map((post) => (
          <div key={post._id} className="article-card">
            <h3>{post.title}</h3>
            <div className="meta">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <p className="excerpt">
              {post.content.substring(0, 150)}...
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}