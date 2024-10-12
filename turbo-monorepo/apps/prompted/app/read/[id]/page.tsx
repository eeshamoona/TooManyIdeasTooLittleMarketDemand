import { Box, Container, Text } from "@mantine/core";
import { createClient } from "../../utils/supabase/server";
import DisplayText from "./components/display";
import { StatsGrid3 } from "./components/stats-grid";

export default async function ReadPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const username = user?.user?.user_metadata?.username ?? null;

  const { data } = await supabase
    .from("submissions")
    .select()
    .eq("id", id)
    .single();

  //TODO: Determine the difference between no permission and no data when the error message is the same
  if (!data) {
    return (
      <Text c="red">You do not have permission to view this submission.</Text>
    );
  }

  return (
    <Container
      style={{ height: "85vh", display: "flex", flexDirection: "column" }}
    >
      <Box style={{ flex: 1, overflow: "hidden" }}>
        <DisplayText
          data={{
            text: data.text,
            character_data: data.character_data,
            prompt: data.prompt,
            word_freq: data.word_freq,
            metadata_stats: data.metadata_stats,
            category: data.category,
          }}
          username={username}
        />
      </Box>

      {/* Stats grids at the bottom */}
      <Box mt="md" style={{ flexShrink: 0 }}>
        <StatsGrid3 stats={data.metadata_stats} />
      </Box>
    </Container>
  );
}
