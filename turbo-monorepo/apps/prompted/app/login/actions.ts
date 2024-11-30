"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

const BASE_URL = "http://localhost:3000";

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
export async function login(formData: FormData): Promise<string | void> {
  const supabase = createClient();

  // Extract email and password from formData
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  console.log("In the login function", data);

  // Validate inputs
  if (!data.email || !data.password) {
    console.warn("Email or password missing");
    return "EMAIL_PASSWORD_REQUIRED";
  }

  // Attempt to log in with the provided credentials
  const { data: loginData, error } =
    await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login Error:", error.message);

    // Handle specific login errors
    if (error.message.includes("Invalid login credentials")) {
      // Check if the email exists in the profiles table
      const { error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", data.email)
        .single();

      if (checkError) {
        console.warn("Email not registered in profiles:", data.email);
        return "EMAIL_NOT_REGISTERED";
      } else {
        console.warn("Incorrect password for email:", data.email);
        return "INCORRECT_PASSWORD";
      }
    }

    // Return a generic error for unexpected cases
    return "UNKNOWN_ERROR";
  }

  // If login succeeds, check if the user exists in profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .single();

  if (profileError) {
    console.warn("Email not found in profiles:", data.email);

    // Sign out the user if the profile is incomplete
    await supabase.auth.signOut();
    console.log("Signed out user:", data.email);
    return "EMAIL_NOT_VERIFIED";
  }

  console.log("User authenticated and profile verified:");

  // Load user badges (optional functionality)
  await loadBadgesForUser(loginData.user.id);

  // Redirect user to the write page
  revalidatePath("/", "layout");
  redirect("/write");
}

/**
 * Handles the login process using a magic link sent to the user's email.
 *
 * @param formData - The form data containing the user's email address.
 * @returns {Promise<string | void>} - Returns a string indicating the login status or void if successful.
 * - "EMAIL_REQUIRED" if the email is not provided.
 * - "EMAIL_NOT_REGISTERED" if the email is not found in the profiles table.
 * - "MAGIC_LINK_ERROR" if there is an error sending the magic link.
 * - "MAGIC_LINK_SENT" if the magic link is sent successfully.
 *
 * Load badges will be called in auth/confirm when they click their magic link
 */
export async function magicLinkLogin(
  formData: FormData
): Promise<string | void> {
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
  const { error: loginError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${BASE_URL}/magic-link-callback`, // Update for production
      shouldCreateUser: false, // Prevent auto sign-up during login
    },
  });

  if (loginError) {
    console.error("Error sending magic link:", loginError.message);
    return "MAGIC_LINK_ERROR" + loginError.message;
  }

  return "MAGIC_LINK_SENT";
}

/**
 * Initiates the sign-up process using a magic link sent to the user's email.
 *
 * @param formData - The form data containing the user's email and username.
 * @returns {Promise<string | void>} - Returns a string indicating the signup status or void if successful.
 * - "EMAIL_USERNAME_REQUIRED" if the email or username is not provided.
 * - "ALREADY_REGISTERED" if the email is already registered.
 * - "SIGNUP_ERROR" followed by the error message if there is an error sending the magic link.
 * - "SIGNUP_SUCCESS" if the magic link is sent successfully.
 *
 * Redirects the sign up link if they don't have a password
 */
export async function magicLinkSignUp(
  formData: FormData
): Promise<string | void> {
  const supabase = createClient();

  // Extract the email from the form data
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;

  if (!email || !username) {
    console.error("Email and username is required.");
    return "EMAIL_USERNAME_REQUIRED";
  }

  // Check if the email exists in the profiles table
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    console.log("User already exists with this email:", email);
    return "ALREADY_REGISTERED";
  }

  // If the email is found, send the magic link
  console.log("Sign up process started...");
  const { error: signUpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${BASE_URL}/magic-link-callback`, // Update for production
      shouldCreateUser: true, // Prevent auto sign-up during login
      data: { username }, // Save username in user metadata
    },
  });

  if (signUpError) {
    console.error("Error sending magic link:", signUpError);
    return "SIGNUP_ERROR";
  }

  console.log("Signup successful. Redirecting to check email...");
  redirect("/check-email?type=signup");
}

/**
 * Handles user signup by processing form data and interacting with Supabase.
 *
 * @param {FormData} formData - The form data containing user signup information.
 * @returns {Promise<string>} - A status string indicating the result of the signup process.
 * - "EMAIL_USERNAME_REQUIRED": Returned if the email or username is not provided.
 * - "ALREADY_REGISTERED": Returned if a user already exists with the provided email.
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
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    console.log("User already exists with this email:", email);
    return "ALREADY_REGISTERED";
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: password || undefined,
    options: {
      data: { username },
    },
  });

  if (signUpError || !signUpData.user) {
    console.error("Signup error:", signUpError.message);
    return "SIGNUP_ERROR";
  }

  console.log("Signup successful. Redirecting to check email...");
  redirect("/check-email?type=signup");
}

/**
 * Sends a password reset link to the user's email if the email exists in the profiles table.
 *
 * @param {FormData} formData - The form data containing the user's email.
 * @returns {Promise<string>} - A status string indicating the result of the password reset process.
 * - "EMAIL_REQUIRED": Returned if the email is not provided.
 * - "EMAIL_NOT_REGISTERED": Returned if the email is not found in the profiles table.
 * - "RESET_LINK_ERROR": Returned if there is an error sending the reset password link.
 * - "RESET_LINK_SENT": Returned if the reset password link is successfully sent.
 */
export const passwordResetLink = async (formData: FormData) => {
  console.log("In password Reset Link");
  const supabase = createClient();

  const email = formData.get("email") as string;

  if (!email) {
    console.error("Email and username are required.");
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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${BASE_URL}/reset-password`,
  });

  if (error) {
    console.error("Error sending reset password link:", error.message);
    return "RESET_LINK_ERROR";
  }

  return "RESET_LINK_SENT";
};
