import { Container, Text } from "@mantine/core";
import { createClient } from "../utils/supabase/server";
import DisplayEntries from "./components/display";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
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
    <Container size="lg">
      <DisplayEntries data={shuffleArray(data)} />
    </Container>
  );
}
