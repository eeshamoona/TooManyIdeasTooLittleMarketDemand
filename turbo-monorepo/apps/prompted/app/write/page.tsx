import { Container } from "@mantine/core";
import { createClient } from "../utils/supabase/server";
import Display from "./components/display";

export default async function Write() {
  const supabase = createClient();
  const { data: prompts, error } = await supabase.from("prompts").select();
  if (error) return <div>{error.message}</div>;

  return (
    <Container size="lg">
      <Display prompts={prompts} />
    </Container>
  );
}
