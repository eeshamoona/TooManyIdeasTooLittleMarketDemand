import { Container, Text } from "@mantine/core";
import { createClient } from "../../utils/supabase/server";
import DisplayText from "./components/display";

export default async function ReadPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const username = user?.user?.user_metadata?.username ?? null;

  const { data } = await supabase
    .from("entries")
    .select()
    .eq("id", id)
    .single();

  //TODO: Determine the difference between no permission and no data when the error message is the same
  if (!data) {
    return <Text c="red">You do not have permission to view this entry.</Text>;
  }

  return (
    <Container
      style={{
        width: "100vw",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DisplayText
        data={{
          text: data.text,
          character_data: data.character_data,
          prompt: data.prompt,
          word_freq: data.word_freq,
          metadata_stats: data.metadata_stats,
          category: data.category,
          created_at: data.created_at,
          ai_feedback: data.ai_feedback,
          id: data.id,
        }}
        username={username}
      />
    </Container>
  );
}
