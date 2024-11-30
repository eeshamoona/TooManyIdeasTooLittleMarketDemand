"use server";
import { createClient } from "../utils/supabase/server";

export async function verifyOtp(token: string, email: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token,
      email,
    });

    console.log("Data", data);

    if (error || !data.user || data.user.email !== email) {
      console.error(
        "Error verifying token:",
        error?.message || "User mismatch"
      );
      return "INVALID_TOKEN";
    }

    return "SUCCESS";
  } catch (error) {
    console.error("Unexpected error:", error);
    return "INVALID_TOKEN";
  }
}

export async function isUserLoggedIn() {
  const supabase = createClient();
  // Fetch user data
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;
  const isLoggedIn = !!user;

  return { isLoggedIn: isLoggedIn, email: user.email };
}
