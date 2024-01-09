import React, { useContext, useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, cartItems } = useAuth();
  const { totalQuantity } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/masterBaker_logo.png" />
        <h3>Master Baker</h3>
      </div>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.firstName}!</span>
        </>
      ) : null}
      <nav className="nav">
        <Link to="/">Welcome</Link>
        <Link to="/about">About Us</Link>
        {isAuthenticated ? (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            {totalQuantity > 0 && (
              <span className="cart-quantity-indicator">{totalQuantity}</span>
            )}
            <button onClick={handleLogout}>Logout</button>
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
