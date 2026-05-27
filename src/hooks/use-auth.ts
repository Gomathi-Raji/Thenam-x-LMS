import { useEffect, useState } from "react";
import { getAuth, login as loginService, logout as logoutService, subscribeAuth, type AuthState } from "@/lib/auth";

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(() => getAuth());

  useEffect(() => subscribeAuth(() => setAuth(getAuth())), []);

  return {
    auth,
    login: loginService,
    logout: logoutService,
  };
}
