"use server";
import { createClient } from "../utils/supabase/server";

export async function isUserLoggedIn() {
  const supabase = createClient();
  // Fetch user data
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;
  const isLoggedIn = !!user;

  return {
    isLoggedIn: isLoggedIn,
    email: user.email,
    username: user.user_metadata.username,
  };
}
