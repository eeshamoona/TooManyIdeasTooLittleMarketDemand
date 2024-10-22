import { Container } from "@mantine/core";
import Display from "./components/display";
import { createClient } from "../../utils/supabase/server";
import { getProgressInfo } from "../../progress/interface";

interface LevelProgress {
  lowThreshold: number;
  highThreshold: number;
  progressValue: number;
  level: number;
}

interface MilestoneProgress {
  progressValue: number;
  achieved: boolean;
}

export default async function ProcessPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const supabase = createClient();

  //TODO: Later on, we will need to check if this has already been processed
  //TODO: Also need to save the progress to the database

  const { data: entriesData, error: entriesError } = await supabase
    .from("entries")
    .select();
  const { data: progressData, error: progressError } = await supabase.from(
    "progress",
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

  if (entriesError) {
    console.error("Error fetching entries:", entriesError);
    return null;
  }

  if (progressError) {
    console.error("Error fetching progress data:", progressError);
    return null;
  }

  // Set current and previous entries
  const currentEntries = entriesData;
  const previousEntries = currentEntries.filter(
    (entry) => entry.id !== Number(id),
  );

  // Function to calculate progress
  const calculateProgress = (
    criteria: string,
    data: any[],
    hasLevels: boolean,
    thresholds: number[],
  ): LevelProgress | MilestoneProgress => {
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

    if (hasLevels) {
      const progressInfo = getProgressInfo(progressValue, thresholds);
      return {
        progressValue: progressValue,
        level: progressInfo.level,
        lowThreshold: progressInfo.lowThreshold,
        highThreshold: progressInfo.highThreshold,
      };
    } else {
      return {
        progressValue: progressValue,
        achieved: Number(progressValue) === Number(id),
      };
    }
  };

  const calculateBadgeProgress = () => {
    return progressData
      .map(
        (progress: {
          achieved: any;
          hasLevels: boolean;
          badges: {
            criteria: string;
            title: string;
            description: string;
            label: string;
            thresholds: number[];
            icon: string;
            id: any;
          };
        }) => {
          if (!progress.achieved) {
            const previousProgress = calculateProgress(
              progress.badges.criteria,
              previousEntries,
              progress.hasLevels,
              progress.badges.thresholds,
            );
            const currentProgress = calculateProgress(
              progress.badges.criteria,
              currentEntries,
              progress.hasLevels,
              progress.badges.thresholds,
            );
            if (progress.hasLevels) {
              const temp = previousProgress as LevelProgress;
              const temp2 = currentProgress as LevelProgress;
              if (temp?.level !== temp2?.level) {
                console.log("Found level change:", temp.level, temp2.level);
                const levelInfo = {
                  startLevel: temp.level,
                  endLevel: temp2.level,
                  startLowValue: temp.lowThreshold,
                  startHighValue: temp.highThreshold,
                  endLowValue: temp2.lowThreshold,
                  endHighValue: temp2.highThreshold,
                  startProgressValue: temp.progressValue,
                  endProgressValue: temp2.progressValue,
                };

                return {
                  badgeId: progress.badges.id,
                  badgeTitle: progress.badges.title,
                  badgeDescription: progress.badges.description,
                  badgeIcon: progress.badges.icon,
                  badgeLabel: progress.badges.label,
                  startValue: temp.progressValue,
                  endValue: temp2.progressValue,
                  level: levelInfo,
                };
              }
            } else {
              const temp = previousProgress as MilestoneProgress;
              const temp2 = currentProgress as MilestoneProgress;
              if (temp?.achieved !== temp2?.achieved) {
                console.log(
                  "Found milestone change:",
                  temp.achieved,
                  temp2.achieved,
                );
                return {
                  badgeId: progress.badges.id,
                  badgeTitle: progress.badges.title,
                  badgeDescription: progress.badges.description,
                  badgeIcon: progress.badges.icon,
                  badgeLabel: progress.badges.label,
                  startValue: temp.progressValue,
                  endValue: temp2.progressValue,
                  achieved: temp2.achieved,
                };
              }
            }
          }
          return null;
        },
      )
      .filter(Boolean);
  };

  // Calculate badge progress
  const badgeProgress = calculateBadgeProgress();
  console.log("Badge Progress:", badgeProgress);

  return (
    <Container size="lg">
      <Display badgeProgress={badgeProgress} entryId={Number(id)} />
    </Container>
  );
}
