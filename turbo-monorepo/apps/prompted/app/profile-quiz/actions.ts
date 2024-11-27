"use server";
import { createClient } from "../utils/supabase/server";

export async function updateProfile(profileData: any) {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ profile: profileData })
    .eq("id", userId)
    .select();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return {
    success: true,
    profile: data?.[0]?.profile,
  };
}
