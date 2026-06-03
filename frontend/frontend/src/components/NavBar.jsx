import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const NavBar = () => {
  const { token, user, logoutUser } = useMovie();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <NavLink to="/dashboard" className="brand-link">
          Placement Portal
        </NavLink>
      </div>
      <div className="nav-links">
        {token ? (
          <>
            <NavLink to="/dashboard" className="nav-link" data-testid="nav-dashboard">
              Dashboard
            </NavLink>
            <NavLink to="/students" className="nav-link" data-testid="nav-students">
              Students
            </NavLink>
            <NavLink to="/companies" className="nav-link" data-testid="nav-companies">
              Companies
            </NavLink>
            <NavLink to="/drives" className="nav-link" data-testid="nav-drives">
              Drives
            </NavLink>
            <NavLink to="/applications" className="nav-link" data-testid="nav-applications">
              Applications
            </NavLink>
            <NavLink to="/interviews" className="nav-link" data-testid="nav-interviews">
              Interviews
            </NavLink>
            <NavLink to="/analytics" className="nav-link" data-testid="nav-analytics">
              Analytics
            </NavLink>
            <NavLink to="/profile" className="nav-link" data-testid="nav-profile">
              Profile ({user?.name || user?.role})
            </NavLink>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-logout"
              data-testid="nav-logout"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link" data-testid="nav-login">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
