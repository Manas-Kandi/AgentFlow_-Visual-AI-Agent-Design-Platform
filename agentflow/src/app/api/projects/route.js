import { supabase } from "@/lib/supabaseClient";
import { getUserFromRequest } from "@/lib/auth";

// GET all projects for the authenticated user
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("user_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data));
}

// POST create new project for the authenticated user
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...body, user_id: user.id }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data[0]));
}
