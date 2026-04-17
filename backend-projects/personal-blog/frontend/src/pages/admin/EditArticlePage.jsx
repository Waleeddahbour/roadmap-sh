import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import articlesApi from "../../api/articlesApi.js";
import ArticleForm from "../../components/common/ArticleForm.jsx";
import BlogShell from "../../components/layout/BlogShell.jsx";
import { useAuth } from "../../context/authContext.jsx";

function EditArticlePage() {
  const { id } = useParams();
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const selected = await articlesApi.getAdminArticleById(authToken, id);

        if (!selected) {
          setError("Article not found.");
        } else {
          setArticle(selected);
        }
      } catch (err) {
        setError(err.message || "Failed to load article.");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [authToken, id]);

  const handleUpdate = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      await articlesApi.updateArticle(authToken, id, {
        title: values.title,
        content: values.content,
      });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to update article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="page-state">Loading...</div>;

  return (
    <BlogShell
      actions={
        <Link className="text-action" to="/admin">
          Back to Dashboard
        </Link>
      }
      className="editor-card"
      title="Update Article"
    >
      {article ? (
        <ArticleForm
          formTitle="Edit existing article"
          initialValues={{
            title: article.title,
            content: article.content,
            publishDate: article.createdAt,
          }}
          errorMessage={error}
          isSubmitting={isSubmitting}
          onSubmit={handleUpdate}
          submitLabel="Update"
        />
      ) : (
        <p className="form-error">{error}</p>
      )}
    </BlogShell>
  );
}

export default EditArticlePage;
