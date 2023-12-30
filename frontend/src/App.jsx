import { useState } from "react";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Funciones para manejar la autenticación
  const login = () => {
    setIsAuthenticated(true);
    // Aquí agregarías más lógica para manejar el inicio de sesión real
  };

  const register = () => {
    setIsAuthenticated(true);
    // Aquí agregarías más lógica para manejar el registro
  };

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      {/* Otros componentes y rutas, pasando login y register como sea necesario */}
    </div>
  );
}

export default App;
