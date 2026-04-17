import { useEffect, useState } from "react";

function toDateInputValue(value) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function ArticleForm({
  initialValues,
  formTitle,
  submitLabel,
  onSubmit,
  errorMessage = "",
  isSubmitting = false,
}) {
  const [values, setValues] = useState({
    title: "",
    publishDate: "",
    content: "",
  });
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setValues({
      title: initialValues?.title || "",
      publishDate:
        toDateInputValue(initialValues?.publishDate) ||
        toDateInputValue(new Date()),
      content: initialValues?.content || "",
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.title.trim() || !values.content.trim()) {
      setValidationError("Title and content are required.");
      return;
    }

    setValidationError("");
    await onSubmit({
      title: values.title.trim(),
      content: values.content.trim(),
      publishDate: values.publishDate,
    });
  };

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <h2 className="section-title">{formTitle}</h2>

      <label className="form-field">
        <span className="field-label">Article Title</span>
        <input
          className="text-input"
          name="title"
          onChange={handleChange}
          type="text"
          value={values.title}
        />
      </label>

      <label className="form-field">
        <span className="field-label">Publishing Date</span>
        <input
          className="text-input"
          name="publishDate"
          onChange={handleChange}
          type="date"
          value={values.publishDate}
        />
      </label>

      <label className="form-field">
        <span className="field-label">Content</span>
        <textarea
          className="text-area"
          name="content"
          onChange={handleChange}
          rows="10"
          value={values.content}
        />
      </label>

      {validationError ? <p className="form-error">{validationError}</p> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default ArticleForm;
