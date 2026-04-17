import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import articlesApi from "../../api/articlesApi.js";
import BlogShell from "../../components/layout/BlogShell.jsx";
import { dateFormat } from "../../utils/dateFormat.js";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const selected = await articlesApi.getGuestArticleById(id);

        if (!selected) {
          setError("Article not found");
        } else {
          setArticle(selected);
        }
      } catch (err) {
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) return <div className="page-state">Loading...</div>;
  if (error) {
    return (
      <BlogShell
        actions={
          <Link className="text-action" to="/">
            Back to Home
          </Link>
        }
        className="article-card"
        title="Article"
      >
        <p className="page-state">Error: {error}</p>
      </BlogShell>
    );
  }

  return (
    <BlogShell
      actions={
        <Link className="text-action" to="/">
          Back to Home
        </Link>
      }
      className="article-card"
      title={article.title}
    >
      {article.createdAt ? (
        <p className="article-page-date">{dateFormat(article.createdAt)}</p>
      ) : null}
      <p className="article-content">{article.content}</p>
    </BlogShell>
  );
}

export default ArticlePage;
