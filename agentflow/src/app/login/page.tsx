"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getUser } from "@/lib/auth/supabaseAuth";
import type { Project } from "@/types";

export default function LoginPage() {
  const [email, setEmail] = useState("manaskandimalla2002@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  type SupabaseUser = {
    id: string;
    email?: string;
    aud?: string;
    role?: string;
    created_at?: string;
    [key: string]: unknown;
  };
  // Removed unused user state

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUser();
        if (user) {
          console.log("Already logged in, redirecting to ProjectDashboard...");
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setError("Failed to verify login status");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    try {
      setLoading(true);
      setError(null);

      console.log("Attempting login with:", email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Login error:", error);
        setError(error.message || "Login failed. Please try again.");
        return;
      }

      console.log("Login successful, redirecting...");
      // Use replace instead of push to prevent back navigation to login
      router.replace("/dashboard");
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Sign In to AgentFlow
            </h1>
            <p className="text-gray-400 text-sm">
              Design powerful agentic workflows visually
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manaskandimalla2002@gmail.com"
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
