import { Container } from "@mantine/core";
import Display from "./components/display";
import { createClient } from "../utils/supabase/server";

export default async function Write() {
  const supabase = createClient();

  // Get prompts
  const { data: prompts, error: promptsError } = await supabase.from("prompts").select();
  if (promptsError) return <div>{promptsError.message}</div>;

  // Get user profile
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) return <div>{userError.message}</div>;

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("profile")
    .eq("id", user?.id)
    .single();
  if (profileError) return <div>{profileError.message}</div>;

  return (
    <Container size="lg">
      <Display prompts={prompts} profile={profiles.profile} />
    </Container>
  );
}
