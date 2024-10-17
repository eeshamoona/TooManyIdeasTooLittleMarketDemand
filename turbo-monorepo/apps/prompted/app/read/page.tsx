import { Container, Text } from "@mantine/core";
import { createClient } from "../utils/supabase/server";
import DisplayEntries from "./components/display";

export default async function Read() {
  const supabase = createClient();

  console.log("Fetching data from entries table...");
  const { data, error } = await supabase.from("entries").select();

  if (error) {
    console.error("Error fetching data:", error.message);
    return (
      <Container>
        <Text c="red">Error: {error.message}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <DisplayEntries data={data} />
    </Container>
  );
}
