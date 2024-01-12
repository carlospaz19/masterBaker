import React, { useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { authToken, isAuthenticated, user, logout } = useAuth();
  const { totalQuantity, fetchCartData } = useCart();

  useEffect(() => {
    if (authToken) {
      fetchCartData(authToken);
    }
  }, [authToken]);

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
            <span className="loggedin">
              <Link to="/products">Products</Link>
            </span>
            <span className="loggedin">
              <Link to="/cart">Cart</Link>

              {totalQuantity > 0 && (
                <span className="cart-quantity-indicator">{totalQuantity}</span>
              )}
            </span>
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
