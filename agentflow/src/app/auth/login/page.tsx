"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { VSCodeInput, VSCodeButton } from "@/components/propertiesPanels/vsCodeFormComponents";
import { Mail, Lock, Github, Globe } from "lucide-react";
import { figmaPropertiesTheme as theme } from "@/components/propertiesPanels/propertiesPanelTheme";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // AuthWrapper will handle redirects if user is already authenticated

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      console.log("Attempting login for:", email);
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        console.error("Login error:", signInError);
        setError(signInError.message);
      } else {
        console.log("Login successful - AuthWrapper will handle redirect");
        // Don't manually redirect - let AuthWrapper handle it
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Test Sign In button handler
  const handleTestSignIn = () => {
    router.replace("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: theme.colors.backgroundSecondary,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "8px",
          padding: "32px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: theme.colors.textPrimary,
              marginBottom: "8px",
            }}
          >
            Sign In to AgentFlow
          </h1>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: "14px",
            }}
          >
            Design powerful agentic workflows visually
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "4px",
            }}
          >
            <p style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ position: "relative" }}>
            <VSCodeInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              style={{ paddingLeft: "40px" }}
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
              placeholder="Enter your password"
              required
              disabled={isLoading}
              style={{ paddingLeft: "40px" }}
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
              <span style={{ color: theme.colors.textSecondary }}>
                Remember me
              </span>
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

          <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
            <VSCodeButton
              type="submit"
              loading={isLoading}
              style={{ width: "100%" }}
            >
              Sign In
            </VSCodeButton>
            <VSCodeButton
              type="button"
              style={{ width: "100%" }}
              onClick={handleTestSignIn}
            >
              Test Sign In
            </VSCodeButton>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: theme.colors.textSecondary,
            }}
          >
            Don&apos;t have an account?{" "}
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
        </form>

        <div
          style={{
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: theme.colors.textSecondary,
              marginBottom: "12px",
            }}
          >
            Or continue with
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
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
        </div>
      </div>
    </div>
  );
// ...existing code...
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
