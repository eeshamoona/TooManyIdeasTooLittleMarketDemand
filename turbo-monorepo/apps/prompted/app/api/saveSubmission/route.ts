import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { text, category, metadata_stats, prompt } = await request.json();

    if (!text || !category || !metadata_stats || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User authentication error:", userError);
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    console.log("User ID:", user.id);

    const { data, error } = await supabase
      .from("submissions")
      .insert([{ text, category, metadata_stats, prompt, user_id: user.id }])
      .select();

    const [submission] = data;
    const submissionId = submission.id;

    if (error) {
      console.error("Database insertion error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Prompt added successfully", submissionId },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
