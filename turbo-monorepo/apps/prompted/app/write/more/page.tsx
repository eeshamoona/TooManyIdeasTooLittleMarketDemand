import { Container } from "@mantine/core";
import { Display } from "./components/display";
import { createClient } from "../../utils/supabase/server";

export default async function Write() {
  const supabase = createClient();
  const { data: prompts, error } = await supabase.from("prompts").select();
  if (error) return <div>{error.message}</div>;

  return (
    <Container>
      <Display prompts={prompts} />
    </Container>
  );
}
