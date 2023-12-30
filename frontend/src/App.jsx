import { useState } from "react";
import Header from "./components/Header";
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
    <div>
      <Header isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default App;
