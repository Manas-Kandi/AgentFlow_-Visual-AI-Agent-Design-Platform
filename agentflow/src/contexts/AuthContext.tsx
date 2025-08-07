"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
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
  // For instant redirect after login
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AuthContext] Initializing auth state...");

    // Get initial user state
    const initAuth = async () => {
      try {
        const initialUser = await getUser();
        console.log(
          "[AuthContext] Initial user:",
          initialUser?.email || "No user"
        );
        setUser(initialUser);
      } catch (error) {
        console.error("[AuthContext] Error getting initial user:", error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log("[AuthContext] Initial auth state loaded");
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: listener } = onAuthStateChange((event, session) => {
      console.log("[AuthContext] Auth state change:", event);
      console.log(
        "[AuthContext] Session user:",
        session?.user?.email || "No user"
      );

      // Update user state
      setUser(session?.user ?? null);

      // Ensure loading is false after any auth state change
      setLoading(false);

      // Handle specific auth events
      if (event === "SIGNED_OUT") {
        console.log("[AuthContext] User signed out");
      } else if (event === "SIGNED_IN") {
        console.log("[AuthContext] User signed in:", session?.user?.email);
      } else if (event === "TOKEN_REFRESHED") {
        console.log("[AuthContext] Token refreshed for:", session?.user?.email);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      if (listener?.subscription) {
        listener.subscription.unsubscribe();
        console.log("[AuthContext] Unsubscribed from auth state changes");
      }
    };
  }, []);

  // Instant redirect after login
  React.useEffect(() => {
    if (user && !loading && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router]);

  // Enhanced sign out function
  const enhancedSignOut = async () => {
    try {
      console.log("[AuthContext] Signing out...");
      const result = await signOut();

      if (!result.error) {
        // Explicitly clear user state
        setUser(null);
        console.log("[AuthContext] Sign out successful");
      }

      return result;
    } catch (error) {
      console.error("[AuthContext] Sign out error:", error);
      return { error: error as Error };
    }
  };

  // Enhanced sign in function
  const enhancedSignIn = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Signing in:", email);
      const result = await signIn(email, password);

      if (!result.error) {
        // The auth state change listener will handle setting the user
        console.log("[AuthContext] Sign in successful");
      } else {
        console.error("[AuthContext] Sign in error:", result.error);
      }

      return result;
    } catch (error) {
      console.error("[AuthContext] Sign in exception:", error);
      return { error: error as Error };
    }
  };

  const value = {
    user,
    loading,
    signIn: enhancedSignIn,
    signUp,
    signOut: enhancedSignOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
