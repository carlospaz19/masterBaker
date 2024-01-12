import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <PayPalScriptProvider
          options={{
            "client-id":
              "AY4lluXTvOYDbeTnJ3v2BX8HRkV0B-CtE9GaoWJPU6ylGXcPDH2WuPIzo5-dbV3BTb7EwJvt-Lz4Gsc1",
          }}
        >
          <App />
        </PayPalScriptProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
