import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
function Login({ setIsLoggedIn }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "ShahadAlotaibi@hashplus.com" && password === "password123") {
      setIsLoggedIn(true);
      navigate("/dashboard");
      setError("");
    } else {
      setError("Invalid email or password");
    }
  }

  

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark" aria-hidden="true">
            <svg className="logo-icon" viewBox="0 0 48 48" role="img">
              <defs>
                <linearGradient id="sh-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <path
                d="M24 4l14 6v12c0 10.5-6.8 19.7-14 22-7.2-2.3-14-11.5-14-22V10l14-6z"
                fill="url(#sh-gradient)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
              />
              <path
                d="M15 19.5c1.8-3.4 6.3-4.8 10.1-3.2 1.6.7 2.7 1.8 3.4 3.1.6 1.1.3 2.5-.8 3.1-1.1.6-2.5.2-3.1-.9-.4-.7-1-1.2-1.8-1.5-1.7-.7-3.8-.1-4.7 1.3-.6.9-.5 2 .3 2.8l8.4 7.8c1.7 1.6 2.1 4 .9 5.8-1.9 2.9-5.7 4.1-9.1 3-1.8-.6-3.2-1.7-4.1-3.1-.6-1.1-.2-2.5.9-3.1 1.1-.6 2.5-.2 3.1.9.5.8 1.3 1.3 2.2 1.6 1.6.5 3.3.1 4.2-1 .5-.7.4-1.7-.3-2.3l-8.4-7.9c-2.1-2-2.7-5.1-1.3-7.7z"
                transform="translate(1.5 -6)"
                fill="rgba(255,255,255,0.92)"
              />
            </svg>
          </div>
          <div className="logo-text">
            <span>HashPlus</span>
            <small>Admin Access</small>
          </div>
        </div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        {error && <p className="error-message">{error}</p>}
          <div className="form-field">
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          </div>

          <button type="submit" >Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
