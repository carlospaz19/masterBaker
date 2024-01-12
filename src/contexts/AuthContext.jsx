import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../backend/api";

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
      getUserData(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const getUserData = async (token) => {
    try {
      const response = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error while recovering user's data:", error);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await api.post(
        "https://masterbaker.onrender.com/validate_token",
        {
          token: token,
        }
      );

      if (response.data.isValid) {
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid Token");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setAuthToken(null);
    }
  };

  const login = async (token) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("token", token);

    try {
      const userResponse = await api.get(
        "https://masterbaker.onrender.com/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(userResponse.data);

      console.log(user);
    } catch (error) {
      console.error(
        "Error al recuperar los datos del usuario o del carrito:",
        error
      );
    }
  };

  const logout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);

    // Cleaning Local Storage
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("totalQuantity");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
