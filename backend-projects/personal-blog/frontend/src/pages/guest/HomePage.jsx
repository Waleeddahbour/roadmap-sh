import { useEffect, useState } from "react";
import articlesApi from "../../api/articlesApi.js";
import ArticleList from "../../components/common/ArticleList.jsx";
import BlogShell from "../../components/layout/BlogShell.jsx";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await articlesApi.getGuestArticles();
        setArticles(response.guestArticles || []);
      } catch (err) {
        setError(err.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) return <div className="page-state">Loading...</div>;
  if (error) return <div className="page-state">Error: {error}</div>;

  return (
    <BlogShell title="Personal Blog">
      <ArticleList articles={articles} />
    </BlogShell>
  );
}

export default HomePage;
