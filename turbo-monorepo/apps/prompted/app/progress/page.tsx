import { Container } from "@mantine/core";
import { createClient } from "../utils/supabase/server";
import Display from "./components/display";

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
      label,
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

  progressData.forEach(async (progress) => {
    //Need to make sure entries array is called data
    //Also need this variable beelow
    // eslint-disable-next-line no-unused-vars
    const timezoneOffset = new Date().getTimezoneOffset() / 60; // Gets timezone offset in hours

    const criteria = progress.badges.criteria;
    let criteriaFunction = null;

    try {
      criteriaFunction = eval(`${criteria}`);
    } catch (err) {
      console.log("Criteria:", criteria);
      console.error("Error evaluating criteria function:", err);
      return;
    }

    // Evaluate the criteria function using the progress data
    const progressValue = criteriaFunction;

    let hasChanges = false;

    if (!progress.hasLevels) {
      if (progressValue === null && progress.achieved === true) {
        progress.achieved = false;
        hasChanges = true;
      } else if (progressValue !== null && progress.achieved === false) {
        progress.achieved = true;
        hasChanges = true;
      }
    } else {
      if (progress.progress !== progressValue) {
        // Save the progress value for this progress entry
        progress.progress = progressValue;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      const savedProgress = {
        id: progress.id,
        user_id: progress.user_id,
        badge_id: progress.badge_id,
        progress: progress.progress,
        achieved: progress.achieved,
        hasLevels: progress.hasLevels,
      };

      // Update only the progress and achieved fields in the progress table for this progress entry
      try {
        const { error } = await supabase.from("progress").upsert(savedProgress);

        if (error) {
          console.error("Error upserting progress:", error);
          return;
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  });

  return (
    <Container size="lg">
      <Display entries={data} progress={progressData} />
    </Container>
  );
}
