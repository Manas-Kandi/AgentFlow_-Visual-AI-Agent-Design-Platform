"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getUser,
  signIn,
  signUp,
  signOut,
  resetPassword,
  onAuthStateChange,
} from "@/lib/auth/supabaseAuth";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthContext] Mount: Fetching initial user...");
    getUser().then((u) => {
      console.log("[AuthContext] Initial user state:", u);
      if (u && !u.email_confirmed_at) {
        console.warn("[AuthContext] User email not verified.");
      }
      setUser(u);
      setLoading(false);
      console.log("[AuthContext] Set user:", u, "Set loading: false");
    });
    const { data: listener } = onAuthStateChange((event, session) => {
      console.log("[AuthContext] Auth state change event:", event);
      console.log("[AuthContext] Session data:", session);
      if (session?.user && !session.user.email_confirmed_at) {
        console.warn("[AuthContext] User email not verified.");
      }
      setUser(session?.user ?? null);
      setLoading(false);
      console.log("[AuthContext] Set user:", session?.user ?? null, "Set loading: false");
    });
    return () => {
      listener?.subscription.unsubscribe();
      console.log("[AuthContext] Unmounted, unsubscribed from auth state changes.");
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
