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

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { data: loginData, error } =
    await supabase.auth.signInWithPassword(data);

  console.log("Login Data:", loginData);

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

    revalidatePath("/", "layout");
    // Start the user on the write page
    redirect("/check-email");
    console.log("Email not in profiles table:", data.email);
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

export async function magicLinkLogin(formData: FormData) {
  const supabase = createClient();

  // Extract the email from the form data
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;

  if (!email) {
    redirect("/error");
    return;
  }

  let errorResponse;

  if (!username) {
    console.log("Login started");
    const { data: loginData, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // TODO: Update this URL to match your application's post-login redirection path
        emailRedirectTo: "http://localhost:3000/magic-link-callback",
        shouldCreateUser: false, // Set to false to prevent automatic sign-up
      },
    });
    if (error) {
      errorResponse = error;
      console.log(errorResponse);
    } else {
      console.log("Login Data information");
      console.log(loginData);
    }
  } else {
    console.log("Signup started");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Update this URL to match your application's post-login redirection path
        emailRedirectTo: "http://localhost:3000/magic-link-callback",
        shouldCreateUser: true, // Set to false to prevent automatic sign-up
        data: {
          username: username,
        },
      },
    });
    if (error) {
      errorResponse = error;
      console.log(errorResponse);
    }
  }

  if (errorResponse) {
    console.error("Login Error:", errorResponse.message);
    return "UNKNOWN_ERROR";
  } else {
    console.log("Going to check your email page");
    redirect("/check-email"); // Inform the user to check their email
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Log form data
  console.log("Form Data:", {
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  });

  // Type-casting here for convenience
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };

  // Check if the user is already signed up
  const { data: existingUser, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .single();

  if (checkError) {
    console.error("Check Error:", checkError);
  }

  if (existingUser) {
    console.log("User already exists with this email:", data.email);
    return "REGISTERED";
  }

  // Log data before signUp
  console.log("Data before signUp:", data);

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
      },
    },
  });

  // Log response from signUp
  console.log("SignUp Response:", signUpData);

  if (error) {
    // Log error
    console.log("SignUp Error:", error);
    console.error("SignUp Error:", error.message);
    return "SIGNUP_ERROR";
  }

  if (!signUpData.user) {
    console.error("No user returned from signUp");
    redirect("/error");
    return;
  }

  // Log successful signup
  console.log("SignUp successful, redirecting...");

  revalidatePath("/", "layout");
  // Redirect to a page that prompts the user to check their email
  redirect("/check-email");
}
