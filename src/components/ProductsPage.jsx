import React, { useState, useEffect } from "react";
import api from "../../backend/api";
import ProductItem from "./ProductItem";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-section">
      <h1>Available Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
      <p>NOTE: To add a product to the cart, press the desired product.</p>
    </div>
  );
};

export default ProductsPage;
