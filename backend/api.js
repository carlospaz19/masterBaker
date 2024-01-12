import axios from "axios";

// Creating axios instance
const api = axios.create({
  baseURL: "https://masterbaker.onrender.com",
  //baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
