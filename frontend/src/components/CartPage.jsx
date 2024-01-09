import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { authToken } = useAuth();
  const { cartItems, removeFromCart } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.productId.price;
    }, 0);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div>
        {cartItems.map((item) => (
          <div className="cart-item" key={item.productId._id}>
            <h2>{item.productId.name}</h2>
            <p>Price: ${item.productId.price} MXN</p>
            <p>Qty: {item.quantity}</p>
            <button
              onClick={() => removeFromCart(item.productId._id, authToken)}
              className="remove-item-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="cart-total">
          <strong>Total: ${calculateTotal()} MXN</strong>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
