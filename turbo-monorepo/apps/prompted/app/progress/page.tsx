import { Container } from "@mantine/core";
import Display from "./components/display";
import { createClient } from "../utils/supabase/server";

export default async function Read() {
  const supabase = createClient();

  const { data, error } = await supabase.from("entries").select();
  const { data: progressData, error: progressError } = await supabase.from(
    "progress"
  ).select(`
    *,
    badges (
      id,
      title,
      criteria,
      description,
      thresholds,
      icon
    )
  `);

  if (error) {
    console.error("Error fetching data:", error);
    // Handle the error appropriately, e.g., show a message to the user
  }

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    // Handle the error appropriately, e.g., show a message to the user
  }

  // Go through each progress entry and calcaulte the progress and achievement
  //First you need to join badges table with progress table
  //Then you need to calculate the progress based on the criteria in the badges table
  // Get progress data by evaluating the criteria function using data
  progressData.forEach((progress) => {
    // Get the badge criteria
    const criteria = progress.badges.criteria;
    const criteriaFunction = eval(`(${criteria})`);

    // Evaluate the criteria function using the progress data
    const progressValue = criteriaFunction;

    if (!progress.hasLevels) {
      if (progressValue !== null) {
        // Save the achievement as true for this progress entry
        progress.achieved = true;
      }
    } else {
      // Save the progress value for this progress entry
      progress.progress = progressValue;
    }

    // Save the progress entry
    supabase.from("progress").upsert(progress);
  });

  return (
    <Container size="lg">
      <Display entries={data} progress={progressData} />
    </Container>
  );
}
