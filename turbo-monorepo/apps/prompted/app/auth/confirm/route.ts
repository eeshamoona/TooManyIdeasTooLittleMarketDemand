import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { loadBadgesForUser } from "../../login/actions";
import { createClient } from "../../utils/supabase/server";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/write";

  if (token_hash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (error) {
      if (error.message === "Email link is invalid or has expired") {
        console.warn("Expired or invalid link accessed");
      } else {
        console.error("OTP verification failed:", error.message);
      }
    } else {
      console.log("OTP verified successfully");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("User authenticated:", user.email);

        // Check if the user's profile is complete
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("profile")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error(
            "Error fetching profile for user:",
            user.id,
            profileError
          );
          const errorMessage = `There was an error fetching profile for userId ${user.id}: ${profileError.message}. You may need to sign up again.`;
          const encodedErrorMessage = encodeURIComponent(errorMessage);
          redirect(`/error?error=${encodedErrorMessage}`);
        }

        // Load badges for the user
        await loadBadgesForUser(user.id);

        if (profileData?.profile.length === 0 && type === "signup") {
          console.warn("User profile incomplete, redirecting to profile form");
          redirect("/profile-quiz");
        }

        console.log("Redirecting user to:", next);
        redirect(next);
      } else {
        console.error("No user found after OTP verification");
      }
    }
  } else {
    console.warn("Missing required parameters: token_hash or type");
  }
  const errorMessage =
    "There was an authenticating your link. Please get a new link.";
  const encodedErrorMessage = encodeURIComponent(errorMessage);
  redirect(`/error?error=${encodedErrorMessage}`);
}
