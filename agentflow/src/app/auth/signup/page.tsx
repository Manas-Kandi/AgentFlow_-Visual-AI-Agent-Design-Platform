"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  VSCodeInput,
  VSCodeButton,
} from "@/components/propertiesPanels/vsCodeFormComponents";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { figmaPropertiesTheme as theme } from "@/components/propertiesPanels/propertiesPanelTheme";

function getPasswordStrength(password: string): string {
  if (password.length < 6) return "Weak";
  if (
    password.match(/[A-Z]/) &&
    password.match(/[0-9]/) &&
    password.length >= 8
  )
    return "Strong";
  return "Medium";
}

export default function SignupPage() {
  const { signUp, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tos, setTos] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  React.useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!tos) {
      setError("You must accept the terms of service.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setShowVerify(true);
    } catch (err: unknown) {
      if (typeof err === "object" && err && "message" in err) {
        setError((err as { message?: string }).message || "Signup failed");
      } else {
        setError("Signup failed");
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
        onSubmit={handleSignup}
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
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Sign Up</h2>
        {error && (
          <div style={{ color: theme.colors.error, fontSize: "13px" }}>
            {error}
          </div>
        )}
        {/* Email input */}
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
        {/* Password input */}
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
        <div style={{ fontSize: "13px", color: theme.colors.textSecondary }}>
          Password strength:{" "}
          <span style={{ fontWeight: 600 }}>
            {getPasswordStrength(password)}
          </span>
        </div>
        {/* Confirm password input */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Lock size={16} style={{ color: theme.colors.textSecondary }} />
          <VSCodeInput
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            checked={tos}
            onChange={(e) => setTos(e.target.checked)}
            style={{ accentColor: theme.colors.buttonPrimary }} // Adjusted from 'accent'
          />
          I accept the{" "}
          <a
            href="/terms"
            style={{ color: theme.colors.textAccent }} // Adjusted from 'link'
          >
            terms of service
          </a>
        </label>
        <VSCodeButton
          type="submit"
          loading={isLoading}
          style={{ width: "100%", marginTop: "8px" }}
        >
          Sign Up
        </VSCodeButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px",
          }}
        >
          <a
            href="/auth/login"
            style={{ color: theme.colors.textAccent }} // Adjusted from 'link'
          >
            Back to login
          </a>
        </div>
        {showVerify && (
          <div
            style={{
              color: theme.colors.info,
              fontSize: "13px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck size={16} />
            Please check your email to verify your account.
          </div>
        )}
      </form>
    </div>
  );
}
