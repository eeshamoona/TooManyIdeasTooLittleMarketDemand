import { Container, Grid, Text, Card } from "@mantine/core";
import { ProgressModel } from "../interface";

interface MilestoneBadgesProps {
  badges: ProgressModel[];
}

const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({ badges }) => {
  return (
    <Container>
      <Grid>
        {badges.map((badge) => (
          <Grid.Col key={badge.id} span={4}>
            <Card
              key={badge.id}
              shadow="sm"
              padding="lg"
              style={{
                opacity: badge.achieved ? 1 : 0.5,
                pointerEvents: badge.achieved ? "auto" : "none",
              }}
            >
              <Text fw={500}>{badge.badges.title}</Text>
              <Text fw={500}>{badge.badges.description}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default MilestoneBadges;
