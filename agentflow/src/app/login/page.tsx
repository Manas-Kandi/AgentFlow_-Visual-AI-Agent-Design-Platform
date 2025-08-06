"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("manaskandimalla2002@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  type SupabaseUser = {
    id: string;
    email?: string;
    aud?: string;
    role?: string;
    created_at?: string;
    [key: string]: unknown;
  };
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("Already logged in, redirecting...");
        window.location.replace("/");
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      console.log("🚀 Attempting login...", { email });

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      console.log("📊 Login response:", { data, error: authError });

      if (authError) {
        throw authError;
      }

      if (data.user) {
        console.log("✅ Login successful:", data.user);
        setSuccess(true);
        setUser(data.user as unknown as SupabaseUser);

        // Multiple redirect attempts
        console.log("🔄 Attempting redirects...");
        // Immediate redirect
        window.location.href = "/";
        // Backup redirects
        setTimeout(() => {
          window.location.replace("/");
        }, 500);
        setTimeout(() => {
          if (window.location.pathname === "/login") {
            window.location.assign("/");
          }
        }, 1000);
      }
    } catch (err) {
      console.error("💥 Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const forceRedirect = () => {
    console.log("🚀 Force redirect clicked");
    window.location.href = "/";
  };

  const checkAndRedirect = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Current session:", session?.user?.email || "No user");
    if (session?.user) {
      window.location.href = "/";
    } else {
      alert("Not logged in yet");
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

          {success && user && (
            <div className="mb-4 p-4 bg-green-900/50 border border-green-700 rounded-md">
              <p className="text-green-200 text-sm mb-3">
                ✅ Login successful! Welcome {user.email}
              </p>
              <button
                onClick={forceRedirect}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors mb-2"
              >
                🚀 Go to AgentFlow →
              </button>
              <button
                onClick={checkAndRedirect}
                className="w-full py-1 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              >
                Check Session & Redirect
              </button>
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

          {/* Debug section */}
          <div className="mt-6 p-3 bg-gray-800 rounded-md">
            <p className="text-xs text-gray-400 mb-2">Debug:</p>
            <button
              onClick={checkAndRedirect}
              className="w-full py-1 px-2 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition-colors"
            >
              Check Auth Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
