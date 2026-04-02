import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}