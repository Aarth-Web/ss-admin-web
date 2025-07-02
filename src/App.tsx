import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Schools } from "./pages/Schools";
import { SchoolDetail } from "./pages/SchoolDetail";
import { Users } from "./pages/Users";
import { Teachers } from "./pages/Teachers";
import { Students } from "./pages/Students";
import { Classes } from "./pages/Classes";

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Determine redirect route based on user role
  const getRedirectRoute = () => {
    if (!isAuthenticated) {
      return "/login";
    }

    if (user?.role === "schooladmin" && user?.school) {
      return `/schools/${user.school}`;
    }

    return "/dashboard";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated && user ? (
              <Navigate to={getRedirectRoute()} />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schools"
          element={
            <ProtectedRoute>
              <Layout>
                <Schools />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/schools/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <SchoolDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Layout>
                <Teachers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Layout>
                <Students />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute>
              <Layout>
                <Classes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={getRedirectRoute()} />} />
        <Route path="*" element={<Navigate to={getRedirectRoute()} />} />
      </Routes>
    </Router>
  );
}

export default App;
