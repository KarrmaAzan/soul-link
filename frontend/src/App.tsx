import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PersonaSetup from "./pages/PersonaSetup";
import ProtectedRoute from "./components/ProtectedRoute";
import PersonaGate from "./components/PersonaGate";
import AuthBootstrap from "./components/AuthBootStrap";

function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/persona-setup" element={<PersonaSetup />} />

          <Route element={<PersonaGate />}>
            <Route path="/*" element={<Layout />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthBootstrap>
  );
}

export default App;