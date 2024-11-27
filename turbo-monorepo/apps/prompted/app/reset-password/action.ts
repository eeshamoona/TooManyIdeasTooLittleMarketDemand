"use server";
import { createClient } from "../utils/supabase/server";
export async function verifyOtp(token: string, email: string) {
  const supabase = createClient();

  console.log("The token is ", token);
  console.log("The email is ", email);

  // Verify the token with Supabase
  const { data, error } = await supabase.auth.verifyOtp({
    type: "recovery",
    token,
    email,
  });

  console.log("Got Data", data);

  if (error) {
    console.error("Error verifying token:", error.message);
    return "INVALID_TOKEN";
  }

  if (data.user.email !== email) {
    console.error("The emails don't match for some reason...");
    return "USER_DATA_ERROR";
  }

  console.log("This gets here?");

  return "SUCCESS";
}
