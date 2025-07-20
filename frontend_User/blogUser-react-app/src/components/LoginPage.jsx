import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3030/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login Failed.");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    }
  }

  return (
    <div className="login-page">
      <form
        className="login-form"
        id="loginForm"
        action="POST"
        onSubmit={handleSubmit}
      >
        <h2 className="login-title">Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username:{" "}
          </label>
          <input
            id="username"
            className="form-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password:{" "}
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
