import { createContext, useContext, useMemo, useState } from "react";
import articlesApi from "../api/articlesApi.js";

const STORAGE_KEY = "personal-blog-admin-token";
const AuthContext = createContext(null);

function getStoredToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) || "";
}

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(getStoredToken);

  const login = async (username, password) => {
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();

    if (!normalizedUsername || !normalizedPassword) {
      throw new Error("Username and password are required.");
    }

    const nextToken = window.btoa(
      `${normalizedUsername}:${normalizedPassword}`,
    );
    await articlesApi.getAdminArticles(nextToken);

    setAuthToken(nextToken);
    window.localStorage.setItem(STORAGE_KEY, nextToken);
  };

  const logout = () => {
    setAuthToken("");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      authToken,
      isAuthenticated: Boolean(authToken),
      login,
      logout,
    }),
    [authToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
