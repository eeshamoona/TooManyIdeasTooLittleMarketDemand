import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";

export async function DELETE(request: Request) {
  const supabase = createClient();
  try {
    // Parse the request body
    const { id } = await request.json();

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    // Perform the deletion in Supabase
    const { error } = await supabase.from("entries").delete().eq("id", id);

    // Handle Supabase errors
    if (error) {
      console.error("Error deleting entry from Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return a success response
    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error("Error handling DELETE request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
