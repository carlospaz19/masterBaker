import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = ({ isAuthenticated }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/masterBaker_logo.png" />
        <h3>Master Baker</h3>
      </div>
      <nav className="nav">
        <Link to="/products">Products</Link>
        <Link to="/about">About Us</Link>
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {isAuthenticated && <Link to="/cart">Cart</Link>}
      </nav>
    </header>
  );
};

export default Header;
