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
    userId: user.id,
  };
}

export async function getData(userId: string) {
  const supabase = createClient();

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select()
    .eq("user_id", userId);

  if (entriesError) {
    throw new Error(`Failed to fetch entries: ${entriesError.message}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .select("profile");

  if (profileError) {
    throw new Error(`Failed to fetch profile: ${profileError.message}`);
  }

  const result = {
    entries: entries || [],
    profile: profile[0].profile || [],
  };
  return result;
}
