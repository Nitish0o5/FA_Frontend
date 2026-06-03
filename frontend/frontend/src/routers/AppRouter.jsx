import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

const AppRouter = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />

          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />

          <Route path="/drives" element={<Drives />} />
          <Route path="/drives/:id" element={<DriveDetail />} />

          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />

          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />

          {/* Fallback */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
