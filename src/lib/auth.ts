export type AuthRole = "admin" | "teacher" | "student" | "parent" | "accounts";

export type AuthState = {
  token: string;
  role: AuthRole;
  identifier: string;
  name?: string;
};

type LoginResponse = { token: string; role: AuthRole; name?: string };

type LoginPayload = {
  role: AuthRole;
  identifier: string;
  access_code?: string;
};

const AUTH_STORAGE_KEY = "aether-auth";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readStoredAuth(): AuthState | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function writeStoredAuth(state: AuthState | null) {
  if (!canUseStorage()) return;

  if (state) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event("aether-auth-change"));
}

export function getAuth(): AuthState | null {
  return readStoredAuth();
}

export function setAuth(state: AuthState) {
  writeStoredAuth(state);
}

export function clearAuth() {
  writeStoredAuth(null);
}

export function getAuthToken(): string | null {
  return getAuth()?.token ?? null;
}

export async function login(payload: LoginPayload) {
  const state = {
    token: "demo-token",
    role: payload.role,
    identifier: payload.identifier,
    name: payload.identifier || payload.role,
  } satisfies AuthState;

  setAuth(state);

  return state;
}


export function logout() {
  clearAuth();
}

export function subscribeAuth(callback: () => void) {
  if (!canUseStorage()) return () => {};

  const onChange = () => callback();
  window.addEventListener("storage", onChange);
  window.addEventListener("aether-auth-change", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("aether-auth-change", onChange);
  };
}
