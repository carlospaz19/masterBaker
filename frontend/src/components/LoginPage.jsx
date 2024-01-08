import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://masterbaker.onrender.com/login",
        {
          email,
          password,
        }
      );
      const { token } = response.data;

      if (token) {
        login(token); // Updates the authentication state and saves the token
        navigate("/");
      } else {
        console.error("No se recibió token del backend");
      }
    } catch (error) {
      console.error("Login Error:", error.response);
    }
  };

  return (
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
