import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../backend/api";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      const { token } = response.data;

      if (token) {
        login(token); // Updates the authentication state and saves the token
        navigate("/");
      } else {
        console.error("Backend token not received");
      }
    } catch (error) {
      console.error("Login Error:", error.response);
      setError("Incorrect username or password");
    }
  };

  useEffect(() => {
    const closePopup = (e) => {
      if (e.target.id === "error-overlay") {
        setError("");
      }
    };

    if (error) {
      window.addEventListener("click", closePopup);
    }

    return () => window.removeEventListener("click", closePopup);
  }, [error]);

  return (
    <>
      {error && (
        <div id="error-overlay" className="error-overlay">
          <div className="error-popup" onClick={() => setError("")}>
            <p>{error}</p>
          </div>
        </div>
      )}
      <div className="login-section">
        <div className="login-container">
          <h2>Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password: </label>
              <div className="password-container">
                <input
                  type={passwordShown ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  className="password-input"
                />
                <i onClick={togglePassword} className="password-icon">
                  {passwordShown ? <FaEyeSlash /> : <FaEye />}
                </i>
              </div>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
