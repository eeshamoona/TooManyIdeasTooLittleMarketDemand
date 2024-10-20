import { Container } from "@mantine/core";
import { createClient } from "../../utils/supabase/server";
import { Shell } from "./components/shell";

export default async function Write() {
  const supabase = createClient();
  const { data: prompts, error } = await supabase.from("prompts").select();
  if (error) return <div>{error.message}</div>;

  return (
    <Container size="lg">
      <Shell prompts={prompts} />
    </Container>
  );
}
