import { Link } from "react-router-dom";
import { dateFormat } from "../../utils/dateFormat.js";

function ArticleList({
  articles,
  variant = "guest",
  emptyMessage = "No articles published yet.",
  onDelete,
}) {
  if (!articles.length) {
    return <p className="list-empty">{emptyMessage}</p>;
  }

  return (
    <ul
      className={`article-list ${variant === "admin" ? "article-list--admin" : ""}`.trim()}
    >
      {articles.map((article) => (
        <li className="article-row" key={article.id}>
          <div className="article-row-main">
            {variant === "guest" ? (
              <Link className="article-link" to={`/article/${article.id}`}>
                {article.title}
              </Link>
            ) : (
              <span className="article-link article-link--static">
                {article.title}
              </span>
            )}
            {variant === "guest" && article.createdAt ? (
              <span className="article-date">
                {dateFormat(article.createdAt)}
              </span>
            ) : null}
          </div>

          {variant === "admin" ? (
            <div className="admin-actions">
              <Link className="text-action" to={`/admin/edit/${article.id}`}>
                Edit
              </Link>
              <button
                className="text-action text-action--danger"
                onClick={() => onDelete?.(article.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default ArticleList;
