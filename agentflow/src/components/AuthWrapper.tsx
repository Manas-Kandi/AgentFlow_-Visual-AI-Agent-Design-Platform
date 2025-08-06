"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

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

  // Centralized redirect logic using context
  useEffect(() => {
    if (loading) return;
    // Only redirect once per route change
    if (hasRedirected.current) return;
    if (!user && !isPublicRoute) {
      hasRedirected.current = true;
      router.replace("/auth/login");
    } else if (user && pathname === "/auth/login") {
      hasRedirected.current = true;
      router.replace("/dashboard");
    }
  }, [user, loading, pathname, router, isPublicRoute]);

  // Reset redirect flag on route change
  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  // Show loading spinner if loading
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
  // Only render children if authenticated or on public route
  if (user || isPublicRoute) {
    return <>{children}</>;
  }
  // Otherwise, null (redirect in progress)
  return null;
}
