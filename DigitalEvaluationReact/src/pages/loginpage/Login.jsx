import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // NORMAL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="brand-title">Department of Evaluation</h1>

      <div className="login-box">
        <h2>Sign in</h2>
        <p className="login-subtitle">Access your account securely</p>

        {/* ❌ GOOGLE REMOVED */}

        <form onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email address"
            required
          />

          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;