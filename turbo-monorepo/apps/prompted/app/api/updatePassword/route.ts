import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Error updating password:", error.message);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 400 }
    );
  }
  console.log("Password updated successfully!");
  return NextResponse.json({ success: true }, { status: 200 });
}
