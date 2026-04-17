import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlogShell from "../../components/layout/BlogShell.jsx";
import { useAuth } from "../../context/authContext.jsx";

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/admin";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(credentials.username, credentials.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogShell className="login-card" title="Admin Login">
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span className="field-label">Username</span>
          <input
            className="text-input"
            name="username"
            onChange={handleChange}
            type="text"
            value={credentials.username}
          />
        </label>

        <label className="form-field">
          <span className="field-label">Password</span>
          <input
            className="text-input"
            name="password"
            onChange={handleChange}
            type="password"
            value={credentials.password}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button
          className="primary-button"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </BlogShell>
  );
}

export default LoginPage;
