import { Grid, Text } from "@mantine/core";
import { ProgressModel } from "../interface";
import MilestoneBadge from "./milestone-badge";

interface MilestoneBadgesProps {
  badges: ProgressModel[];
}

const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({ badges }) => {
  const sortByAchieved = (a: ProgressModel, b: ProgressModel) => {
    if (a.achieved && !b.achieved) {
      return -1;
    }
    if (!a.achieved && b.achieved) {
      return 1;
    }
    return 0;
  };

  const sortedBadges = badges.sort(sortByAchieved);

  return (
    <>
      <Grid mt="md" justify="center">
        {sortedBadges.map((badge) => (
          <Grid.Col
            key={badge.id}
            style={{
              maxWidth: "150px",
              minHeight: "180px",
              height: "auto",
            }}
          >
            <MilestoneBadge
              title={badge.badges.title}
              hidden={!badge.achieved}
              icon={badge.badges.icon}
              description={badge.badges.description}
            />
            {badge.achieved && (
              <Text ta="center" size="md">
                {badge.badges.title}
              </Text>
            )}
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default MilestoneBadges;
