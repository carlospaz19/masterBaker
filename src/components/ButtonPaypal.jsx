import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const ButtonPaypal = ({ currency, showSpinner, amount }) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { authToken } = useAuth();
  const { cartItems, removeFromCart, fetchCartData } = useCart();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
    fetchCartData(authToken);
  }, [currency, showSpinner]);

  const style = { layout: "vertical" };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              console.log("then");
              return orderId;
            });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function () {
            console.log("APPROVE");
            cartItems.forEach((item) => {
              removeFromCart(item.productId._id, authToken);
            });

            fetchCartData(authToken);
          });
        }}
      />
    </>
  );
};
