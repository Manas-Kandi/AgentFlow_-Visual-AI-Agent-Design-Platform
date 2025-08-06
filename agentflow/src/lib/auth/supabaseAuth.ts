import { createClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };
  if (!data.user?.email_confirmed_at) {
    return { error: new Error("Please verify your email before logging in.") };
  }
  return { error: null };
}

export async function signIn(email: string, password: string) {
  console.log("Attempting to sign in with email:", email);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Sign-in error:", error);
    return { error };
  }
  const user = await getUser();
  console.log("Fetched user after sign-in:", user);
  if (!user) {
    console.error("Login failed. No user found.");
    return { error: new Error("Login failed. Please try again.") };
  }
  return { error: null };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
