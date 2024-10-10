import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { text, category } = await request.json();

    if (!text || !category) {
      return NextResponse.json(
        { error: "Text and category are required" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("prompts")
      .insert([{ text, category }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Prompt added successfully", data },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
