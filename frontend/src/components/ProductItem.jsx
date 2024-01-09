import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./ProductItem.css";

const ProductItem = ({ product }) => {
  const { authToken } = useAuth();
  const { addToCart, fetchCartData } = useCart();

  const handleAddToCart = async () => {
    if (!authToken) {
      console.error("User is not logged in");
      return;
    }

    try {
      await addToCart(product, authToken);
      await fetchCartData(authToken); // This will update the Cart and the totalQuantity
    } catch (error) {
      console.error("Error while adding product to cart:", error);
    }
  };

  return (
    <div className="product-item" onClick={handleAddToCart}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>${product.price} MXN</p>
    </div>
  );
};

export default ProductItem;
