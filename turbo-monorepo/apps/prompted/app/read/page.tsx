import { Container, Text } from "@mantine/core";
import { createClient } from "../utils/supabase/server";
import DisplaySubmissions from "./components/display";

export default async function Read() {
  const supabase = createClient();

  console.log("Fetching data from submissions table...");
  const { data, error } = await supabase.from("submissions").select();

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
      <DisplaySubmissions data={data} />
    </Container>
  );
}
