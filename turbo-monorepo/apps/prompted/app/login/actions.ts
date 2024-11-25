"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function loadBadgesForUser(userId: string) {
  const supabase = createClient();
  console.log(`Loading progress for user: ${userId}`);

  // Step 1: Fetch all badges from the badges table
  const { data: badges, error: badgesError } = await supabase
    .from("badges")
    .select("*");

  if (badgesError) {
    console.error("Error fetching badges:", badgesError);
    return;
  }

  console.log(`Fetched ${badges.length} badges from the badges table.`);

  const totalBadges = badges.length;

  // Step 2: Fetch user's current progress from the progress table
  const { data: userProgress, error: progressError } = await supabase
    .from("progress")
    .select("badge_id")
    .eq("user_id", userId);

  if (progressError) {
    console.error("Error fetching user progress:", progressError);
    return;
  }

  const userProgressCount = userProgress.length;

  // Check if progress is up to date (i.e., the user already has progress for all badges)
  if (userProgressCount === totalBadges) {
    console.log("Progress table is already up to date. No insertions needed.");
    return;
  }

  // Step 3: Get a list of badge_ids the user already has progress for
  const existingBadgeIds = userProgress.map((progress) => progress.badge_id);

  // Step 4: Filter badges that are missing from the user's progress
  const badgesToInsert = badges.filter(
    (badge) => !existingBadgeIds.includes(badge.id)
  );

  // Step 5: Insert missing badges with default values into the progress table
  const progressInserts = badgesToInsert.map((badge) => ({
    user_id: userId,
    badge_id: badge.id,
    progress: 0, // Default progress
    achieved: false, // Default achieved status
    hasLevels: badge.hasLevels, // Match the badge's hasLevels value
  }));

  if (progressInserts.length > 0) {
    console.log(`Inserting ${progressInserts.length} missing progress rows.`);
    const { error: insertError } = await supabase
      .from("progress")
      .insert(progressInserts);

    if (insertError) {
      console.error("Error inserting missing progress rows:", insertError);
    } else {
      console.log(`Inserted ${progressInserts.length} missing progress rows.`);
    }
  } else {
    console.log("No missing progress rows to insert.");
  }
}

/**
 * Handles the password login process for a user using the provided form data.
 *
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {Promise<string | void>} - Returns a string indicating the login status or void if successful.
 *
 * Possible return values:
 * - "EMAIL_PASSWORD_REQUIRED": If email or password is missing.
 * - "EMAIL_NOT_VERIFIED": If the email is not found in the profiles table.
 * - "EMAIL_NOT_REGISTERED": If the email is not registered.
 * - "INCORRECT_PASSWORD": If the password is incorrect.
 * - "UNKNOWN_ERROR": For any other login errors.
 *
 * Loads badges for user if authenticated and redirects to /write page
 */
export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  if (!data.email || !data.password) {
    return "EMAIL_PASSWORD_REQUIRED";
  }

  const { data: loginData, error } =
    await supabase.auth.signInWithPassword(data);

  console.log("Login Data successful, checking if verified user");

  // Check if the email is in the profiles table
  const { data: existingUser, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .single();

  // If login succeeds but email is not in profiles table
  if (loginData.user !== null && checkError) {
    //Sign out the user
    await supabase.auth.signOut();
    console.log("Email not in profiles table:", data.email);

    revalidatePath("/", "layout");
    // Start the user on the write page
    redirect("/check-email");
    return "EMAIL_NOT_VERIFIED";
  }
  if (error) {
    console.error("Login Error:", error.message);
    if (error.message.includes("Invalid login credentials")) {
      if (checkError) {
        return "EMAIL_NOT_REGISTERED";
      } else if (existingUser) {
        return "INCORRECT_PASSWORD";
      }
    }
    return "UNKNOWN_ERROR";
  }

  await loadBadgesForUser(loginData.user.id);

  revalidatePath("/", "layout");
  // Start the user on the write page
  redirect("/write");
}

/**
 * Handles the login process using a magic link sent to the user's email.
 *
 * @param formData - The form data containing the user's email address.
 * @returns A string indicating the result of the login attempt:
 * - "EMAIL_REQUIRED" if the email is not provided.
 * - "EMAIL_NOT_REGISTERED" if the email is not found in the profiles table.
 * - "MAGIC_LINK_ERROR" if there is an error sending the magic link.
 * - "MAGIC_LINK_SENT" if the magic link is sent successfully.
 * - "UNKNOWN_ERROR" if an unexpected error occurs during authentication.
 *
 * Load badges will be called in auth/confirm when they click their magic link
 */
export async function magicLinkLogin(formData: FormData) {
  const supabase = createClient();

  // Extract the email from the form data
  const email = formData.get("email") as string;

  if (!email) {
    console.error("Email is required.");
    return "EMAIL_REQUIRED";
  }

  // Check if the email exists in the profiles table
  const { data: existingUser, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (checkError || !existingUser) {
    console.error("Email not found in profiles table.");
    return "EMAIL_NOT_REGISTERED";
  }

  // If the email is found, send the magic link
  console.log("Login process started...");
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/magic-link-callback", // Update for production
        shouldCreateUser: false, // Prevent auto sign-up during login
      },
    });

  if (loginError) {
    console.error("Error sending magic link:", loginError.message);
    return "MAGIC_LINK_ERROR";
  }

  console.log("Magic link sent successfully.");
  redirect("/check-email");
  return "MAGIC_LINK_SENT";
}

/**
 * Handles user signup by processing form data and interacting with Supabase.
 *
 * @param {FormData} formData - The form data containing user signup information.
 * @returns {Promise<string>} - A status string indicating the result of the signup process.
 * - "EMAIL_USERNAME_REQUIRED": Returned if the email or username is not provided.
 * - "ALREADY_REGISTERED": Returned if a user already exists with the provided email.
 * - "UNKNOWN_ERROR": Returned for unexpected errors during user existence check or signup.
 * - "SIGNUP_ERROR": Returned if there is an error during the signup process.
 * - "SIGNUP_SUCCESS": Returned if the signup is successful and redirects to the check email page.
 *
 * Load badges will be called in auth/confirm when they click their magic link
 */
export async function signup(formData: FormData): Promise<string> {
  const supabase = createClient();

  // Extract email, password, and username from form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string | null; // Password is optional
  const username = formData.get("username") as string;

  // Log the received form data for debugging
  console.log("Form Data:", { email, password, username });

  // Ensure required fields are present
  if (!email || !username) {
    console.error("Email and username are required.");
    return "EMAIL_USERNAME_REQUIRED";
  }

  // Check if the user is already signed up
  const { data: existingUser, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (checkError || !existingUser) {
    console.log("User already exists with this email:", email);
    return "ALREADY_REGISTERED";
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: password || undefined, // Let Supabase auto-generate password if not provided
    options: {
      data: { username }, // Save username in user metadata
    },
  });

  if (signUpError || !signUpData.user) {
    console.error("Signup error:", signUpError.message);
    return "SIGNUP_ERROR";
  }

  console.log("Signup successful. Redirecting to check email...");
  redirect("/check-email");
  return "SIGNUP_SUCCESS";
}
