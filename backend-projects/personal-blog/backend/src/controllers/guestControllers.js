import { loadArticles } from "../config/db.js";

export const getArticles = async (req, res, next) => {
  const articles = await loadArticles();

  const guestArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    createdAt: article.createdAt,
  }));

  return res.status(200).json({ status: "success", guestArticles });
};
