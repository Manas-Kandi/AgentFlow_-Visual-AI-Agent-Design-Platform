import { supabase } from "../supabaseClient";
import type { NextRequest } from "next/server";

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function requireAuth(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) throw new Error("Unauthorized");
  return user;
}
