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

  // Always redirect if user is present and not loading
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
      // No need to manually redirect here; useEffect will handle it
    } catch (err: unknown) {
      if (typeof err === "object" && err && "message" in err) {
        setError((err as { message?: string }).message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          background: theme.colors.backgroundSecondary, // Adjusted from 'panel'
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.medium, // Adjusted from 'shadows.panel'
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
          <div style={{ color: theme.colors.error, fontSize: "13px" }}>
            {error}
          </div>
        )}
        {/* Email input (single, with icon inline) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Mail size={16} style={{ color: theme.colors.textSecondary }} />
          <VSCodeInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* Password input (single, with icon inline) */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Lock size={16} style={{ color: theme.colors.textSecondary }} />
          <VSCodeInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ accentColor: theme.colors.buttonPrimary }} // Adjusted from 'accent'
          />
          Remember me
        </label>
        <VSCodeButton
          type="submit"
          loading={isLoading}
          style={{ width: "100%", marginTop: "8px" }}
        >
          Login
        </VSCodeButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          {/* Adjusted from 'link' */}
          <a href="/auth/signup" style={{ color: theme.colors.textAccent }}>
            Sign up
          </a>
          {/* Adjusted from 'link' */}
          <a
            href="/auth/reset-password"
            style={{ color: theme.colors.textAccent }}
          >
            Forgot password?
          </a>
        </div>
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <VSCodeButton
            variant="secondary"
            disabled
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Globe size={16} /> Google
          </VSCodeButton>
          <VSCodeButton
            variant="secondary"
            disabled
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Github size={16} /> GitHub
          </VSCodeButton>
        </div>
      </form>
    </div>
  );
}
