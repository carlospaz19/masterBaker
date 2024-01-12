import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import api from "../../backend/api";

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(() => {
    const storedTotalQuantity = localStorage.getItem("totalQuantity");
    return storedTotalQuantity ? parseInt(storedTotalQuantity, 10) : 0;
  });
  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      fetchCartData(authToken);
    }
  }, []);

  const fetchCartData = async (token) => {
    let cartData;
    try {
      const cartResponse = await api.get(
        "https://masterbaker.onrender.com/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cartData = cartResponse.data.cart || [];

      setCartItems(cartData);

      localStorage.setItem("cart", JSON.stringify(cartData));

      const newTotalQuantity = cartData.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setTotalQuantity(newTotalQuantity);
      console.log(`Total de productos en el carrito: ${newTotalQuantity}`);
      localStorage.setItem("totalQuantity", newTotalQuantity.toString());
    } catch (error) {
      console.error(
        "Error al recuperar los datos del usuario o del carrito:",
        error
      );
    }
  };

  const addToCart = async (product, token) => {
    try {
      const response = await api.post(
        "https://masterbaker.onrender.com/cart/add",
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartData(token);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (productId, token) => {
    try {
      await api.post(
        "https://masterbaker.onrender.com/cart/remove",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Updates the state of the Cart filtering the removed product
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
      fetchCartData(token);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        fetchCartData,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
