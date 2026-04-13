import { connectDB, saveArticles } from "../config/db.js";
import { now } from "../utils/dateTime.js";

function getNextArticleId(articles) {
  const numericIds = articles
    .map((article) => Number(article.id))
    .filter((id) => Number.isFinite(id));

  return numericIds.length === 0 ? 1 : Math.max(...numericIds) + 1;
}


export const addNewArticle = async (req, res, next) => {
  const { title, content } = req.body ?? {};
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedContent = typeof content === "string" ? content.trim() : "";

  if (!normalizedTitle || !normalizedContent) {
    return res.status(400).json({
      status: "fail",
      message: "title and content are required"
    });
  }

  const articles = await connectDB();
  const nextId = getNextArticleId(articles);

  const newArticle = {
    id: nextId,
    title: normalizedTitle,
    content: normalizedContent,
    createdAt: now(),
    updatedAt: now()
  };

  articles.push(newArticle);
  await saveArticles(articles);

  return res.status(201).json({
    status: "success",
    message: "Article added successfully",
    data: { id: newArticle.id, title: newArticle.title }
  });
};


export const editArticle = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid id."
    });
  }

  const { title, content } = req.body ?? {};
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedContent = typeof content === "string" ? content.trim() : "";

  const articles = await connectDB();
  const toEdit = articles.find((article) => article.id === id);

  if (!toEdit) {
    return res.status(404).json({
      status: "fail",
      message: "Article not found"
    });
  }

  if (normalizedTitle) toEdit.title = normalizedTitle;
  if (normalizedContent) toEdit.content = normalizedContent;
  toEdit.updatedAt = now();

  await saveArticles(articles);

  return res.status(200).json({
    status: "success",
    message: "Updated successfully",
    data: {
      title: toEdit.title,
      content: toEdit.content,
      updatedAt: toEdit.updatedAt
    }
  });
};

export const deleteArticle = async (req, res, next) => {
  const id = Number(req.params.id ?? req.body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid id."
    });
  }

  const articles = await connectDB();
  const toDeleteIndex = articles.findIndex((article) => article.id === id);
  
  if (toDeleteIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Article not found"
    });
  }
  articles.splice(toDeleteIndex, 1);
  await saveArticles(articles);

  return res.status(200).json({ 
    status: "success", 
    message: `Deleted article ${id}`
  });
};