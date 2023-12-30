const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/User"); // Asegúrate de importar el modelo de usuario
const jwt = require("jsonwebtoken");
const Cart = require("./models/Cart");
const Product = require("./models/Product"); // Asegúrate de importar el modelo de producto
const Order = require("./models/Order");
const authenticate = require("./middlewares/authenticate");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.log(err));

// Rutas CRUD
// GET: Listar todos los productos
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Crear un nuevo producto
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

// PUT: Actualizar un producto existente por ID
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

// DELETE: Eliminar un producto por ID
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

// Configuración del servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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

// Ruta GET para listar todos los usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}); // Encuentra todos los usuarios
    // Opcionalmente, puedes limitar la información que se envía al cliente
    // Por ejemplo, excluyendo las contraseñas y otros datos sensibles
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Email or Password is incorrect" });
    }

    // Crear un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar producto del carrito
app.post("/cart/remove", authenticate, async (req, res) => {
  // Obtiene el ID del producto desde el cuerpo de la solicitud
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    // Obtiene el ID del usuario del middleware de autenticación
    const userId = req.user.userId;

    // Busca el carrito del usuario
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Product not found in the cart." });
    }

    // Elimina el producto del carrito
    cart.products.splice(productIndex, 1);

    // Guarda los cambios en el carrito
    await cart.save();

    res.status(200).json({ message: "Product deleted from the cart.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Finalizar compra
app.post("/cart/checkout", authenticate, async (req, res) => {
  try {
    // Obtiene el ID del usuario del middleware de autenticación
    const userId = req.user.userId;

    // Busca el carrito del usuario
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "The cart is empty." });
    }

    // Procesar los productos en el carrito (Ejemplo básico)
    let total = 0;
    cart.products.forEach((item) => {
      total += item.productId.price * item.quantity;
      // Aquí podrías también disminuir el stock del producto, si manejas inventario
    });

    // Crear una orden (necesitas definir un modelo Order si aún no lo has hecho)
    const order = new Order({
      userId,
      products: cart.products,
      total,
      // Aquí puedes añadir más campos como dirección de envío, etc.
    });
    await order.save();

    // Vaciar el carrito
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "Products buyed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar un producto al carrito
app.post("/cart/add", authenticate, async (req, res) => {
  // Obtiene el ID del producto y la cantidad desde el cuerpo de la solicitud
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Product and quantity are required." });
  }

  try {
    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Obtiene el ID del usuario del middleware de autenticación
    const userId = req.user.userId;

    // Busca el carrito del usuario o crea uno nuevo si no existe
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Busca si el producto ya existe en el carrito
    const productIndex = cart.products.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex > -1) {
      // Producto ya existe en el carrito, actualiza la cantidad
      cart.products[productIndex].quantity += quantity;
    } else {
      // Producto no existe en el carrito, lo añade
      cart.products.push({ productId, quantity });
    }

    // Guarda los cambios en el carrito
    await cart.save();

    res.status(200).json({ message: "Product added to the cart.", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener el carrito del usuario
app.get("/cart", authenticate, async (req, res) => {
  try {
    // Obtiene el ID del usuario del middleware de autenticación
    const userId = req.user.userId;

    // Busca el carrito del usuario
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Opcional: Puedes calcular el total aquí si no se almacena en la base de datos
    const total = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.productId.price,
      0
    );

    // Devuelve el carrito con el total calculado
    res.status(200).json({ cart: cart.products, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
