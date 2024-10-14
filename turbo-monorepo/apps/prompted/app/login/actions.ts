"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  // Start the user on the write page
  redirect("/write");
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
  // In practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    username: formData.get("username") as string,
  };

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
    redirect("/error");
    return;
  }

  if (!signUpData.user) {
    console.error("No user returned from signUp");
    redirect("/error");
    return;
  }

  // Log successful signup
  console.log("SignUp successful, redirecting...");

  revalidatePath("/", "layout");
  //TODO: Redirect to a page that prompts the user to check their email
  redirect("/login");
}
