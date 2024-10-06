import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function POST(request: Request) {
  console.log("Request received");
  try {
    const { todo } = await request.json();
    console.log("Parsed request body:", { todo });

    if (!todo) {
      console.error("Todo is required");
      return NextResponse.json({ error: "Todo is required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase.from("todos").insert({ text: todo });
    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Todo added successfully", data },
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
