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
    "/auth/signup",
    "/auth/reset-password",
    "/auth/verify-email",
    "/login",
    "/signup",
    "/forgot-password",
  ];
  
  const isPublicRoute = publicRoutes.includes(pathname);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  // Handle authentication redirects
  useEffect(() => {
    // Don't redirect while loading auth state
    if (loading) return;
    
    // Prevent multiple redirects for the same route
    if (hasRedirected.current) return;

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
      console.log("[AuthWrapper] Redirecting to login - no user, protected route");
      hasRedirected.current = true;
      router.replace("/login");
      return;
    }

    if (user && pathname === "/login") {
      console.log(
        "[AuthWrapper] Redirecting to dashboard - user authenticated on login page"
      );
      hasRedirected.current = true;
      router.replace("/dashboard");
      return;
    }
  }, [user, loading, pathname, router, isPublicRoute]);

  // Show loading spinner while auth state is loading
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

  // Only render children if:
  // - User is authenticated (for protected routes)
  // - On a public route (regardless of auth state)
  if (user || isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading while redirect is in progress for protected routes
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  );
}
