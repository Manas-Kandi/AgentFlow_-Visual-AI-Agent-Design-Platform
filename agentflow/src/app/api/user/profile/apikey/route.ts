import { NextRequest, NextResponse } from "next/server";
import { updateUserApiKey } from "@/lib/userProfileService";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, apiKey } = body || {};
    if (!userId || !apiKey) {
      return NextResponse.json({ error: "Missing userId or apiKey" }, { status: 400 });
    }
    const ok = await updateUserApiKey(userId, apiKey);
    if (!ok) {
      return NextResponse.json({ error: "Failed to update API key" }, { status: 500 });
    }
    // Never return the API key
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error)?.message || "Internal error" }, { status: 500 });
  }
}
