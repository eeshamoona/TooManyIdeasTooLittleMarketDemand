import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  console.log("GET request received");

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // default to /write if no next parameter is provided
  const next = searchParams.get("next") ?? "/write";

  console.log("token_hash:", token_hash);
  console.log("type:", type);
  console.log("next:", next);

  if (token_hash && type) {
    const supabase = createClient();
    console.log("Supabase client created");

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (error) {
      console.error("Error verifying OTP:", error);
    } else {
      console.log("OTP verified successfully");
      // redirect user to specified redirect URL or root of app
      redirect(next);
      return;
    }
  } else {
    console.log("Missing token_hash or type");
  }

  // redirect the user to an error page with some instructions
  console.log("Redirecting to /error");
  redirect("/error");
}
