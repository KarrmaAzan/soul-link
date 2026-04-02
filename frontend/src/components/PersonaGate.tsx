import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PersonaGate() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return null;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!user.hasPersona) return <Navigate to="/persona-setup" replace />;

  return <Outlet />;
}