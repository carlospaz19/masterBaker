import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./CartPage.css";
import { ButtonPaypal } from "./ButtonPaypal";

const CartPage = () => {
  const { authToken } = useAuth();
  const { cartItems, removeFromCart, fetchCartData } = useCart();

  useEffect(() => {
    if (authToken) {
      fetchCartData(authToken);
    }
  }, [authToken]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.quantity * item.productId.price;
    }, 0);
  };

  const mxnToDolar = 18;
  const totalAmount = calculateTotal();

  const totalToPay = totalAmount / mxnToDolar;
  const usdTotalToPay = parseFloat(totalToPay.toFixed(2));

  const hasItemsInCart = cartItems.length > 0;

  return (
    <div className="cart-section">
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.productId._id}>
              <h2>{item.productId.name}</h2>
              <p className="quantity">Qty: {item.quantity}</p>
              <p className="price">Price: ${item.productId.price} MXN</p>
              <button
                onClick={() => removeFromCart(item.productId._id, authToken)}
                className="remove-item-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ${totalAmount} MXN</strong>
            {hasItemsInCart && (
              <div style={{ width: "100px" }} className="paypal-button">
                <ButtonPaypal
                  currency={"USD"}
                  showSpinner={false}
                  amount={usdTotalToPay}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
