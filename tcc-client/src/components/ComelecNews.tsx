import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ComelecNews.module.css";

interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

const ComelecNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const NEWS_API_KEY = "266b3539d8d4497abc1233aaa89f3156";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get<{ articles: Article[] }>(
          `https://newsapi.org/v2/everything?q=COMELEC&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
        );
        setArticles(response.data.articles);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className={styles.heading}>Loading COMELEC news...</p>;
  if (error)
    return (
      <p className={styles.heading} style={{ color: "red" }}>
        {error}
      </p>
    );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📰 COMELEC News & Announcements</h2>

      <div className={styles.newsList}>
        {articles.map((article, index) => (
          <div key={index} className={styles.card}>
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} />
            )}
            <div className={styles.cardContent}>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              {article.description && (
                <p className={styles.description}>{article.description}</p>
              )}
              <small className={styles.date}>
                {new Date(article.publishedAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComelecNews;