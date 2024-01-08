import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      validateToken(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post(
        "https://masterbaker.onrender.com/validate_token",
        {
          token: token,
        }
      );

      if (response.data.isValid) {
        setIsAuthenticated(true);
      } else {
        throw new Error("Token no válido");
      }
    } catch (error) {
      console.error("Error al validar el token:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setAuthToken(null);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setAuthToken(token);

    // Calling BE to get user's data
    try {
      const response = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error retrieving user's data:", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
