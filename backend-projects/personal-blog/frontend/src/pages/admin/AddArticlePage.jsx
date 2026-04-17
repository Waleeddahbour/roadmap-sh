import { Link, useNavigate } from "react-router-dom";
import articlesApi from "../../api/articlesApi.js";
import ArticleForm from "../../components/common/ArticleForm.jsx";
import BlogShell from "../../components/layout/BlogShell.jsx";
import { useAuth } from "../../context/authContext.jsx";
import { useState } from "react";

function AddArticlePage() {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (values) => {
    setError("");
    setIsSubmitting(true);

    try {
      await articlesApi.createArticle(authToken, {
        title: values.title,
        content: values.content,
      });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogShell
      actions={
        <Link className="text-action" to="/admin">
          Back to Dashboard
        </Link>
      }
      className="editor-card"
      title="New Article"
    >
      <ArticleForm
        formTitle="Create a new article"
        initialValues={{ publishDate: new Date().toISOString() }}
        errorMessage={error}
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
        submitLabel="Publish"
      />
    </BlogShell>
  );
}

export default AddArticlePage;
