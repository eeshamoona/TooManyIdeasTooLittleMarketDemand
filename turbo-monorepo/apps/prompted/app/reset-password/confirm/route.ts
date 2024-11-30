import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const next = searchParams.get("next") ?? "/reset-password";

  if (!token || !email) {
    console.warn("Missing required parameters: token or email");
    redirect("/error?message=Missing required parameters");
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: "recovery",
    token,
    email,
  });

  if (error) {
    console.error("OTP verification failed:", error.message);
    const errorMessage =
      error.message === "Email link is invalid or has expired"
        ? "The link is invalid or has expired."
        : "OTP verification failed.";
    redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
    return;
  }

  console.log("OTP verified successfully, redirecting to:", next);
  redirect(next);
}
