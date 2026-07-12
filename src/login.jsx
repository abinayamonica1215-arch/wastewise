import { useState } from "react";
import { loginUser } from "./auth.js";

function Login({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const result = loginUser({ email, password });
    if (!result.success) {
      setError(result.message);
      return;
    }
    setError("");
    onLoginSuccess(result.user);
  }

  return (
    <div className="page">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <button type="button" className="link-button" onClick={onGoToRegister}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;