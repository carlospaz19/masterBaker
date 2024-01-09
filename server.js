const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Cart = require("./models/Cart");
const Product = require("./models/Product");
const Order = require("./models/Order");
const authenticate = require("./middlewares/authenticate");

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.log(err));

// Server configuration
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// CRUD Users
// Register user
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET to list all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}); // Find all users
    const userDisplay = users.map((user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    });
    res.json(userDisplay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Email or Password is incorrect" });
    }

    // Create token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    console.log(req.user);

    next();
  });
};

// Get for User Info
app.get("/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validating token
app.post("/validate_token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ isValid: false, message: "No token provided." });
  }

  try {
    // Verifying token using the 'JWT_SECRET'
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If there is no error, the token is valid
    res.json({ isValid: true, decoded });
  } catch (error) {
    res.status(401).json({ isValid: false, message: "Invalid token." });
  }
});

// CRUD Products
// GET: List all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create new product
app.post("/products", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update product by ID
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove product by Id
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD Cart
// Delete product from Cart
app.post("/cart/remove", authenticate, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    // Get the ID of theuser from the authentication middleware
    const userId = req.user.userId;

    // Look for the cart of the user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Saves the changes in the cart
    await cart.save();

    res.status(200).json({ message: "Product deleted from the cart.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Finalize the purchase
app.post("/cart/checkout", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Finds the cart of the user
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "The cart is empty." });
    }

    // Process the products in the cart
    let total = 0;
    cart.products.forEach((item) => {
      total += item.productId.price * item.quantity;
    });

    // Creates the order
    const order = new Order({
      userId,
      products: cart.products,
      total,
      address,
    });
    await order.save();

    // Empty cart
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Products buyed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route the add the product to the cart
app.post("/cart/add", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Product and quantity are required." });
  }

  try {
    // Verifying if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Obtains the user ID from the authentication middleware
    const userId = req.user.userId;

    // Look for the cart of the user or creates a new one if doesn't exist
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Look if the product exists in the cart
    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex > -1) {
      // Product already exists in the cart, updating the quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // Product does not exist, updating the quantity
      cart.products.push({ productId, quantity });
    }

    // Saves the changes in the cart
    await cart.save();

    res.status(200).json({ message: "Product added to the cart.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to obtain the cart of the user
app.get("/cart", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Look for the cart of the user
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Optional: Calculate the total of the cart if no saved in the DB
    const total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.productId.price,
      0
    );

    // Returns cart total
    res.status(200).json({ cart: cart.products, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
