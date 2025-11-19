import React, { useState, useEffect } from 'react';
import { newsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './News.css';

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await newsAPI.getArticles();
      setArticles(response.data);
    } catch (err) {
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await newsAPI.refreshArticles();
      setArticles(response.data);
    } catch (err) {
      console.error('Error refreshing articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="news-header">
          <h1 className="page-title">Mental Health News</h1>
          <button onClick={handleRefresh} className="btn btn-secondary" disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              {article.image_url && (
                <img src={article.image_url} alt={article.title} className="article-image" />
              )}
              <div className="article-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <div className="article-footer">
                  <span className="source">{article.source}</span>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && !loading && (
          <div className="card">
            <p>No articles available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
