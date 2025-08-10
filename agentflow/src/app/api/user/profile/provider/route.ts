import { NextRequest, NextResponse } from "next/server";
import { updateUserLLMProvider } from "@/lib/userProfileService";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, provider } = body || {};
    if (!userId || (provider !== "weev" && provider !== "byok")) {
      return NextResponse.json({ error: "Missing userId or invalid provider" }, { status: 400 });
    }
    const ok = await updateUserLLMProvider(userId, provider);
    if (!ok) {
      return NextResponse.json({ error: "Failed to update provider" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error)?.message || "Internal error" }, { status: 500 });
  }
}
