"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getCurrentUser,
  login,
  register,
  loginWithGoogle,
  logout as apiLogout,
  verifyLogin2FA,
} from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string; redirect?: string; requiresTwoFactor?: boolean }>;
  verify2FA: (
    email: string,
    otp: string,
  ) => Promise<{ ok: boolean; message?: string; redirect?: string }>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string }>;
  signInGoogle: () => Promise<{ ok: boolean; redirect?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fix: use startTransition to defer setState in effect
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const u = (await getCurrentUser()) as User | null;

      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await login(email, password);
    if (res.success && res.data) {
      if (res.data.requiresTwoFactor) {
        return { ok: true, requiresTwoFactor: true };
      }
      setUser(res.data.user as User);
      const redirect = res.data.user.role === "admin" ? "/admin" : "/account";
      return { ok: true, redirect };
    }
    return { ok: false, message: res.message ?? "Xəta baş verdi" };
  }, []);

  const verify2FA = useCallback(async (email: string, otp: string) => {
    const res = await verifyLogin2FA(email, otp);
    if (res.success && res.data) {
      setUser(res.data.user as User);
      const redirect = res.data.user.role === "admin" ? "/admin" : "/account";
      return { ok: true, redirect };
    }
    return { ok: false, message: res.message ?? "Yanlış kod" };
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await register(name, email, password);
      if (res.success) {
        // User is not logged in yet, need to verify OTP
        return { ok: true };
      }
      return { ok: false, message: res.message ?? "Xəta baş verdi" };
    },
    [],
  );

  const signInGoogle = useCallback(async () => {
    const res = await loginWithGoogle("Google User", "guest@gmail.com");
    if (res.success && res.data) {
      setUser(res.data.user as User);
      return {
        ok: true,
        redirect: res.data.user.role === "admin" ? "/admin" : "/account",
      };
    }
    return { ok: false };
  }, []);

  const signOut = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, verify2FA, signUp, signInGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
