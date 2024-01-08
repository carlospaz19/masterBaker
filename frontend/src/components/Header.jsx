import React, { useEffect, useContext } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  // const callAPI = async () => {
  //   const url = "https://masterbaker.onrender.com/users";

  //   const res = await axios.get(url);
  //   setUserData(res.data);
  // };
  // useEffect(() => {
  //   callAPI();
  // }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src="/masterBaker_logo.png" />
        <h3>Master Baker</h3>
      </div>
      <nav className="nav">
        <Link to="/">Welcome</Link>
        <Link to="/about">About Us</Link>
        {isAuthenticated ? (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
