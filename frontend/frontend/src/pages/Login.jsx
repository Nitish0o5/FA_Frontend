import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const Login = () => {
  const { loginUser } = useMovie();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await loginUser(email, password);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container page-container" data-testid="login-page">
      <div className="login-card card">
        <h2 className="mb-4 text-center">Sign In</h2>
        <p className="text-muted text-center mb-4">
          Access the Placement Recruitment System
        </p>

        {error && <div className="alert alert-danger mb-3" data-testid="login-error">{error}</div>}

        <form onSubmit={handleLoginSubmit} className="login-form" id="login-form">
          <div className="form-group mb-3">
            <label htmlFor="email-input">Email Address</label>
            <input
              type="email"
              id="email-input"
              className="email-input form-control"
              data-testid="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. admin@test.com"
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password-input">Password</label>
            <input
              type="password"
              id="password-input"
              className="password-input form-control"
              data-testid="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="login-btn btn btn-primary w-100 py-2"
            data-testid="login-btn"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-muted small">
          <p>Demo accounts:</p>
          <p className="mb-1">Admin: <code>admin@test.com</code> / <code>admin123</code></p>
          <p>Student: use student ID as password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
