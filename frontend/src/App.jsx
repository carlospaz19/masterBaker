import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Welcome from "./components/Welcome";
import About from "./components/About";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const register = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
