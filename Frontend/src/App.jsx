import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Catalogo from './pages/Catalogo';
import FormFilme from './pages/FormFilme';
import DetalhesFilme from './pages/DetalhesFilme';

const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route path="/catalogo" element={<RotaProtegida><Catalogo /></RotaProtegida>} />

        <Route path="/filme/novo" element={<RotaProtegida><FormFilme /></RotaProtegida>} />

        <Route path="/filme/editar/:id" element={<RotaProtegida><FormFilme /></RotaProtegida>} />

        <Route path="/filme/:id" element={<RotaProtegida><DetalhesFilme /></RotaProtegida>} />
      </Routes>
    </Router>
  );
}

export default App;