"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/reset-password",
    "/login",
    "/signup",
    "/forgot-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        setUser(session?.user ?? null);
        setLoading(false);

        // Only redirect if we haven't already redirected
        if (!hasRedirected) {
          if (!session?.user && !isPublicRoute) {
            // User not logged in and trying to access protected route
            console.log("AuthWrapper: Redirecting to login - no user");
            setHasRedirected(true);
            router.replace("/auth/login");
          } else if (session?.user && pathname === "/auth/login") {
            // User logged in but on login page - redirect to dashboard
            console.log("AuthWrapper: Redirecting to dashboard - user on login page");
            setHasRedirected(true);
            router.replace("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (!isMounted) return;

      setUser(session?.user ?? null);
      setLoading(false);

      // Handle auth state changes with redirect prevention
      if (event === "SIGNED_IN" && !hasRedirected) {
        console.log("AuthWrapper: User signed in, redirecting to dashboard");
        setHasRedirected(true);
        router.replace("/dashboard");
      } else if (event === "SIGNED_OUT" && !hasRedirected) {
        console.log("AuthWrapper: User signed out, redirecting to login");
        setHasRedirected(true);
        router.replace("/auth/login");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, pathname, isPublicRoute, hasRedirected]);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    setHasRedirected(false);
  }, [pathname]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading AgentFlow...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated and on protected route
  if (!user && !isPublicRoute) {
    return null; // Will redirect to /auth/login
  }

  // Show children if authenticated or on public route
  return <>{children}</>;
}
