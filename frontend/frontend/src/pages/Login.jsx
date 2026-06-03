import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await api.login(email, password);
      if (token) {
        window.appState = window.appState || {};
        window.appState.token = token;
        window.appState.authUser = user || null;
        try {
          localStorage.setItem("app_token", token);
        } catch (e) {}
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <h2>Login</h2>
      <form onSubmit={submit} className="login-form">
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <div>
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
