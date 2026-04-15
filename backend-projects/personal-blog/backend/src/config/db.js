import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

const __dirname = import.meta.dirname;
const dbFileName = process.env.DB_FILE || "articles.json";

export const dbPath = path.resolve(__dirname, "..", "..", "db", dbFileName);

export async function connectDB() {
  try {
    const articlesFile = await fs.readFile(dbPath, "utf-8");
    const articles = JSON.parse(articlesFile);
    console.log("DB connected successfully");
    return articles;
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(dbPath, "[]", "utf-8");
      console.log(`DB file created successfully path: ${dbPath}`);
      const articlesFile = await fs.readFile(dbPath, "utf-8");
      const articles = JSON.parse(articlesFile);
      console.log("DB connected successfully");
      return articles;
    }
    throw err;
  }
}

export async function saveArticles(articles) {
  await fs.writeFile(dbPath, JSON.stringify(articles, null, 2), "utf-8");
}
