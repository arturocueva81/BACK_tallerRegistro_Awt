import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registrar from "./pages/Registrar";
import Perfil from "./pages/Perfil";
import GestionMascotas from "./pages/GestionMascotas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/gestion" element={<GestionMascotas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;