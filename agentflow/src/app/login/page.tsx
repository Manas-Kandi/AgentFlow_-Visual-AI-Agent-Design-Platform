"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/lib/supabaseAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
          disabled={loading}
        />
        <button type="submit" className="bg-blue-500 text-white p-2" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
