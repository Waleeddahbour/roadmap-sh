import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import DashboardPage from "../pages/admin/DashboardPage.jsx";
import AddArticlePage from "../pages/admin/AddArticlePage.jsx";
import EditArticlePage from "../pages/admin/EditArticlePage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import HomePage from "../pages/guest/HomePage.jsx";
import ArticlePage from "../pages/guest/ArticlePage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<ArticlePage />} path="/article/:id" />
      <Route element={<LoginPage />} path="/login" />
      <Route
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        path="/admin"
      />
      <Route
        element={
          <ProtectedRoute>
            <AddArticlePage />
          </ProtectedRoute>
        }
        path="/admin/new"
      />
      <Route
        element={
          <ProtectedRoute>
            <EditArticlePage />
          </ProtectedRoute>
        }
        path="/admin/edit/:id"
      />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default AppRoutes;
