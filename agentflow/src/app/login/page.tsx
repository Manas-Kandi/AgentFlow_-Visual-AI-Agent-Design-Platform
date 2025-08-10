"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Hardcoded developer credentials (demo-only)
const DEV_USERNAME = "dev";
const DEV_PASSWORD = "weev123";

export default function DevLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (username === DEV_USERNAME && password === DEV_PASSWORD) {
        // Store a faux developer user in localStorage so the app picks it up
        const devUser = {
          id: "dev-00000000-0000-0000-0000-000000000000",
          email: "dev@weev.local",
          name: "Dev User",
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("dev_user", JSON.stringify(devUser));
        }
        // Redirect to dashboard (home page)
        router.replace("/");
      } else {
        setError("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-white/80">Developer Login</CardTitle>
          <CardDescription className="text-sm text-white/50">
            Demo-only sign in to access Model Provider settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dev"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="weev123"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-white/40 w-full text-center">
            Use dev / weev123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
