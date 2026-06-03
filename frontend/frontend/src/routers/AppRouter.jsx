import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import StudentDetail from "../pages/StudentDetail";
import Companies from "../pages/Companies";
import CompanyDetail from "../pages/CompanyDetail";
import Drives from "../pages/Drives";
import DriveDetail from "../pages/DriveDetail";
import Applications from "../pages/Applications";
import ApplicationDetail from "../pages/ApplicationDetail";
import Analytics from "../pages/Analytics";
import Login from "../pages/Login";
import Interviews from "../pages/Interviews";
import Profile from "../pages/Profile";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useMovie();
  if (loading) return <div className="loading-screen text-center mt-5">Loading system data...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { token, loading } = useMovie();
  if (loading) return <div className="loading-screen text-center mt-5">Loading system data...</div>;
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <StudentDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:id"
            element={
              <ProtectedRoute>
                <CompanyDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/drives"
            element={
              <ProtectedRoute>
                <Drives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drives/:id"
            element={
              <ProtectedRoute>
                <DriveDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <Interviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
