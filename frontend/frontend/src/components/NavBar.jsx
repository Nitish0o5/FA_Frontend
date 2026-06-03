import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="nav-bar">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/students">Students</NavLink>
      <NavLink to="/companies">Companies</NavLink>
      <NavLink to="/drives">Drives</NavLink>
      <NavLink to="/applications">Applications</NavLink>
      <NavLink to="/analytics">Analytics</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
};

export default NavBar;
