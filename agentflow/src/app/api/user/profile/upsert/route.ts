import { NextRequest, NextResponse } from "next/server";
import { upsertUserProfile } from "@/lib/userProfileService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, llmProvider } = body || {};
    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });
    }
    const profile = await upsertUserProfile(userId, email, llmProvider || "weev");
    if (!profile) {
      return NextResponse.json({ error: "Failed to upsert profile" }, { status: 500 });
    }
    // Do not return any sensitive data
    return NextResponse.json({ id: profile.id, email: profile.email, llm_provider: profile.llm_provider });
  } catch (err) {
    return NextResponse.json({ error: (err as Error)?.message || "Internal error" }, { status: 500 });
  }
}
