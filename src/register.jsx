import { useState } from "react";
import { registerUser } from "./auth.js";

function Register({ onRegisterSuccess, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Industry/Institution");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const result = registerUser({ name, email, password, role });
    if (!result.success) {
      setError(result.message);
      return;
    }
    setError("");
    onRegisterSuccess(result.user);
  }

  return (
    <div className="page">
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Industry/Institution</option>
            <option>Municipality/Admin</option>
          </select>
        </label>
        <label>
          Full Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
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
        <button type="submit">Create Account</button>
      </form>
      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" className="link-button" onClick={onGoToLogin}>
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;