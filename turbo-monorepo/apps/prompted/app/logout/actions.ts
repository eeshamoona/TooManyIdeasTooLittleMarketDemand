"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function signout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    const errorMessage = `There was an error signing out: ${error.message}`;
    const encodedErrorMessage = encodeURIComponent(errorMessage);
    redirect(`/error?error=${encodedErrorMessage}`);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
