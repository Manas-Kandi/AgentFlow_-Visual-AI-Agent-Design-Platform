import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, getUserApiKey } from '@/lib/userProfileService';

// Default Weev-hosted API key
const WEEV_NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || process.env.NEXT_PUBLIC_NVIDIA_API_KEY;
const RAW_BASE = process.env.NVIDIA_BASE_URL || process.env.NEXT_PUBLIC_NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
// Normalize base URL to ensure it includes /v1
function normalizeBase(url: string): string {
  const trimmed = url.replace(/\/$/, "");
  if (/\/v\d+$/.test(trimmed)) return trimmed; // already ends with /v<digit>
  // If base doesn't include version segment, append /v1
  return `${trimmed}/v1`;
}

export async function GET(request: NextRequest) {
  // Extract user ID from request headers (this would be set by auth middleware in a real implementation)
  const userId = request.headers.get("x-user-id");
  const byokHeader = request.headers.get('x-byok-api-key');
  
  let nvidiaApiKey = WEEV_NVIDIA_API_KEY;
  
  // Dev/mock override: allow BYOK key via header when present
  if (byokHeader) {
    nvidiaApiKey = byokHeader;
  } else if (userId) {
    // If user ID is provided, check for BYOK preference
    const userProfile = await getUserProfile(userId);
    if (userProfile && userProfile.llm_provider === "byok") {
      const userApiKey = await getUserApiKey(userId);
      if (userApiKey) {
        nvidiaApiKey = userApiKey;
      }
    }
  }
  
  if (!nvidiaApiKey) {
    return NextResponse.json({ error: "NVIDIA API key not configured" }, { status: 400 });
  }
  
  try {
    const target = `${NVIDIA_BASE_URL.replace(/\/$/, "")}/models`;
    const res = await fetch(target, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${nvidiaApiKey}`,
      }
    });
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream NVIDIA error", status: res.status, target, body: text }, { status: res.status });
    }
    return new NextResponse(text, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error)?.message || "Internal error" }, { status: 500 });
  }
}
const NVIDIA_BASE_URL = normalizeBase(RAW_BASE);

export async function POST(req: NextRequest) {
  // Extract user ID from request headers (this would be set by auth middleware in a real implementation)
  const userId = req.headers.get("x-user-id");
  const byokHeader = req.headers.get('x-byok-api-key');
  
  let nvidiaApiKey = WEEV_NVIDIA_API_KEY;
  
  // Dev/mock override: allow BYOK key via header when present
  if (byokHeader) {
    nvidiaApiKey = byokHeader;
  } else if (userId) {
    // If user ID is provided, check for BYOK preference
    const userProfile = await getUserProfile(userId);
    if (userProfile && userProfile.llm_provider === "byok") {
      const userApiKey = await getUserApiKey(userId);
      if (userApiKey) {
        nvidiaApiKey = userApiKey;
      }
    }
  }
  
  if (!nvidiaApiKey) {
    return NextResponse.json({ error: "NVIDIA API key not configured" }, { status: 400 });
  }

  try {
    const body = await req.json();
    // Basic validation
    if (!body || typeof body !== "object" || !body.model || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Invalid request body: expected { model, messages, ... }" }, { status: 400 });
    }

    const target = `${NVIDIA_BASE_URL.replace(/\/$/, "")}/chat/completions`;
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nvidiaApiKey}`,
      },
      body: JSON.stringify({
        stream: false,
        ...body,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      // Forward error details to client with target URL context
      return NextResponse.json({ error: "Upstream NVIDIA error", status: res.status, target, body: text }, { status: res.status });
    }

    return new NextResponse(text, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return NextResponse.json({ error: (err as Error)?.message || "Internal error" }, { status: 500 });
  }
}
