import { Container, Grid } from "@mantine/core";
import { ProgressModel } from "../interface";
import MilestoneBadge from "./milestone-badge";

interface MilestoneBadgesProps {
  badges: ProgressModel[];
}

const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({ badges }) => {
  return (
    <Container>
      <Grid>
        {badges.map((badge) => (
          <Grid.Col
            key={badge.id}
            span={{ base: 6, xs: 4, sm: 3, md: 3, lg: 3, xl: 3 }}
          >
            <MilestoneBadge
              title={badge.badges.title}
              hidden={!badge.achieved}
              icon={badge.badges.icon}
              description={badge.badges.description}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default MilestoneBadges;
