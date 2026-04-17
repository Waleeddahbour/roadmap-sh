import { httpClient } from "./httpClient";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function findArticleById(list, id) {
  return list.find((article) => String(article.id) === String(id)) || null;
}

function authHeader(token) {
  return token ? { Authorization: `Basic ${token}` } : {};
}

const articlesApi = {
  getGuestArticles: () => httpClient(`${backendUrl}/`),

  async getGuestArticleById(id) {
    const response = await this.getGuestArticles();
    return findArticleById(response.guestArticles || [], id);
  },

  getAdminArticles: (token) =>
    httpClient(`${backendUrl}/admin`, {
      headers: authHeader(token),
    }),

  async getAdminArticleById(token, id) {
    const response = await this.getAdminArticles(token);
    return findArticleById(response.articles || [], id);
  },

  createArticle: (token, payload) =>
    httpClient(`${backendUrl}/admin/new`, {
      method: "POST",
      headers: authHeader(token),
      body: payload,
    }),

  updateArticle: (token, id, payload) =>
    httpClient(`${backendUrl}/admin/edit/${id}`, {
      method: "PATCH",
      headers: authHeader(token),
      body: payload,
    }),

  deleteArticle: (token, id) =>
    httpClient(`${backendUrl}/admin/delete/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    }),
};

export default articlesApi;
