"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  VSCodeInput,
  VSCodeButton,
} from "@/components/propertiesPanels/vsCodeFormComponents";
import { Mail, Lock, Github, Globe } from "lucide-react";
import { figmaPropertiesTheme as theme } from "@/components/propertiesPanels/propertiesPanelTheme";

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // FIXED: Redirect to dashboard consistently
  useEffect(() => {
    if (!loading && user) {
      console.log("User authenticated, redirecting to dashboard");
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting login process...");
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      console.log("Login successful, auth state change will handle redirect");
      // Don't set isLoading to false here - let the redirect happen
    } catch (err: unknown) {
      console.error("Login exception:", err);
      if (typeof err === "object" && err && "message" in err) {
        setError((err as { message?: string }).message || "Login failed");
      } else {
        setError("Login failed");
      }
      setIsLoading(false);
    }
  };

  // Show loading spinner if redirecting or loading
  if (loading || user) {
    return (
      <div
        style={{
          background: theme.colors.background,
          color: theme.colors.textPrimary,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: `4px solid ${theme.colors.buttonPrimary}`,
              borderTop: `4px solid ${theme.colors.backgroundSecondary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px auto",
            }}
          />
          <p style={{ color: theme.colors.textSecondary }}>Loading AgentFlow...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme.colors.background,
        color: theme.colors.textPrimary,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.medium,
          padding: "32px",
          minWidth: "340px",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Sign In</h2>

        {error && (
          <div
            style={{
              color: theme.colors.error,
              fontSize: "13px",
              padding: "8px 12px",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderRadius: "4px",
              border: `1px solid ${theme.colors.error}`,
            }}
          >
            {error}
          </div>
        )}

        <div>
          <VSCodeInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manaskandimalla2002@gmail.com"
            required
            disabled={isLoading}
            style={{ marginBottom: "12px" }}
          />
          <Mail
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: theme.colors.textSecondary,
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <VSCodeInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••••"
            required
            disabled={isLoading}
          />
          <Lock
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: theme.colors.textSecondary,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              style={{ accentColor: theme.colors.borderActive }}
            />
            Remember me
          </label>
          <a
            href="/auth/reset-password"
            style={{
              color: theme.colors.textAccent,
              textDecoration: "none",
            }}
          >
            Forgot password?
          </a>
        </div>

        <VSCodeButton
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.buttonPrimary,
            color: "white",
            padding: "12px",
            fontSize: "14px",
            fontWeight: 500,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Signing in..." : "Login"}
        </VSCodeButton>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <a
            href="/auth/signup"
            style={{
              color: theme.colors.textAccent,
              textDecoration: "none",
            }}
          >
            Sign up
          </a>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: theme.colors.backgroundSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              color: theme.colors.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            <Github size={16} />
            GitHub
          </button>
          <button
            type="button"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: theme.colors.backgroundSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "4px",
              color: theme.colors.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            <Globe size={16} />
            Google
          </button>
        </div>
      </form>
    </div>
  );
}
