import { Container, Text } from "@mantine/core";
import { createClient } from "../../utils/supabase/server";
import { StatsGrid } from "../../write/components/stats";
import DisplayText from "./components/display";

export default async function ReadPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const supabase = createClient();

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
    <Container>
      <DisplayText data={data} />
      <StatsGrid stats={data.metadata_stats} />
    </Container>
  );
}
