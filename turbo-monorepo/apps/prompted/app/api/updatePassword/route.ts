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

  // Update the user's password
  const { error } = await supabase.auth.updateUser({
    email,
    password,
  });

  if (error) {
    console.error("Error updating password:", error.message);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
