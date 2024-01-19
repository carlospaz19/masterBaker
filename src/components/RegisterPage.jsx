import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../../backend/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Registering user
      await api.post("/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // After successful login, login is made
      const loginResponse = await api.post("/login", {
        email,
        password,
      });

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
      setError("Email account is in use, please try with a different one");
    }
  };

  const closePopup = () => {
    setMessage("");
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
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
