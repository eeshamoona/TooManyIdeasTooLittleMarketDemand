"use server";
import { createClient } from "../../utils/supabase/server";
export const updateEntryFeedback = async (entryId: string, aiFeedback: any) => {
  const supabase = createClient();

  // Validate that aiFeedback is a proper JSON object
  if (
    typeof aiFeedback !== "object" ||
    aiFeedback === null ||
    Array.isArray(aiFeedback)
  ) {
    throw new Error("Invalid feedback format: Must be a JSON object");
  }

  try {
    const { data, error } = await supabase
      .from("entries")
      .update({ ai_feedback: aiFeedback })
      .eq("id", entryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating entry feedback:", error);
    throw error;
  }
};
