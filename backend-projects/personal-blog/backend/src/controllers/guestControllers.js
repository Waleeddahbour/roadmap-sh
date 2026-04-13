import { connectDB } from "../config/db.js";

export const getArticles = async (req, res, next) => {
  const articles = await connectDB();
  return res.status(200).json({ status: "success", articles });
};