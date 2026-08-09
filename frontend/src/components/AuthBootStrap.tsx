import { useEffect } from "react";
import { getMe } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { DEMO_MODE } from "../demoData";

type Props = {
  children: React.ReactNode;
};

export default function AuthBootstrap({ children }: Props) {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    if (DEMO_MODE) return;
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    async function boot() {
      if (DEMO_MODE) return;
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const user = await getMe(token);
        setUser(user);
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
        clearAuth();
      }
    }

    if (hydrated) {
      boot();
    }
  }, [token, hydrated, setUser, clearAuth]);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
