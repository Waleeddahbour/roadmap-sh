import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import articlesApi from "../../api/articlesApi.js";
import ArticleList from "../../components/common/ArticleList.jsx";
import BlogShell from "../../components/layout/BlogShell.jsx";
import { useAuth } from "../../context/authContext.jsx";

function DashboardPage() {
  const { authToken, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await articlesApi.getAdminArticles(authToken);
        setArticles(response.articles || []);
      } catch (err) {
        setError(err.message || "Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [authToken]);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this article?");
    if (!shouldDelete) return;

    try {
      await articlesApi.deleteArticle(authToken, id);
      setArticles((current) => current.filter((article) => article.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete article.");
    }
  };

  if (loading) return <div className="page-state">Loading...</div>;

  return (
    <BlogShell
      actions={
        <>
          <Link
            className="primary-button primary-button--inline"
            to="/admin/new"
          >
            + Add
          </Link>
          <button className="text-action" onClick={logout} type="button">
            Logout
          </button>
        </>
      }
      title="Personal Blog"
    >
      {error ? <p className="form-error">{error}</p> : null}
      <ArticleList
        articles={articles}
        emptyMessage="No articles available for admin yet."
        onDelete={handleDelete}
        variant="admin"
      />
    </BlogShell>
  );
}

export default DashboardPage;
