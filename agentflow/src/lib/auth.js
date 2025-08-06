import { supabase } from "./supabaseClient.js";

export async function getUserFromRequest(req) {
  const authHeader = req.headers.get("Authorization");
  const token =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
