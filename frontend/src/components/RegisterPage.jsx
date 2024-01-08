import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      // Registering user
      await axios.post("https://masterbaker.onrender.com/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // After successful login, login is made
      const loginResponse = await axios.post(
        "https://masterbaker.onrender.com/login",
        {
          email,
          password,
        }
      );

      // Token response
      const { token } = loginResponse.data;

      if (token) {
        login(token);
        navigate("/");
      } else {
        console.error("Login failed after registration");
      }
    } catch (error) {
      console.error("Error registering / login user", error.response);
    }
  };

  return (
    <div className="register-section">
      <div className="register-container">
        <h2>Register</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label>Email: </label>
            <input
              type="email"
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
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
