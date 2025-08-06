import { supabase } from "@/lib/supabaseClient";
import { getUserFromRequest } from "@/lib/auth";

// GET all connections for a project belonging to the authenticated user
export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");

  const { data, error } = await supabase
    .from("connections")
    .select()
    .eq("project_id", projectId)
    .eq("user_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data));
}

// POST create new connection for a project
export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("connections")
    .insert([{ ...body, user_id: user.id }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data[0]));
}
