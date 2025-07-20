import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./navBar";

function LoginForm() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3030/api/loginAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("res: ", res);

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

  // return (
  //   <form action="POST" onSubmit={handleSubmit}>
  //     <p >Login</p>
  //     {error && <p style={{ color: "red" }}>{error}</p>}

  //     <div>
  //       <label htmlFor="username">Username: </label>
  //       <input
  //         id="username"
  //         type="text"
  //         placeholder="Username"
  //         value={username}
  //         onChange={(e) => setUserName(e.target.value)}
  //         required
  //       />
  //     </div>

  //     <div>
  //       <label htmlFor="password">Password: </label>
  //       <input
  //         id="password"
  //         type="text"
  //         placeholder="Password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         required
  //       />
  //     </div>

  //     <button type="submit">Login</button>
  //   </form>
  // );
  return (
    <div className="login-page">
      <form
        className="login-form"
        id="loginForm"
        onSubmit={handleSubmit}
        method="POST"
      >
        <h2 className="login-title">Admin Login</h2>

        {error && <p className="login-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            className="form-input"
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            placeholder="Enter Password"
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
