"use client";
import { useState } from "react";
import { featureDescriptions } from "./motivation";
import {
  Container,
  Stack,
  Card,
  Center,
  Group,
  Title,
  Grid,
  Text,
  useMantineTheme,
  Transition,
} from "@mantine/core";

const FeatureHighlight: React.FC<{ answerQ4: string }> = ({ answerQ4 }) => {
  const theme = useMantineTheme();
  const [selectedFeature, setSelectedFeature] = useState(answerQ4 || "A");

  const rotateFeatures = (clickedKey: string) => {
    setSelectedFeature(clickedKey);
  };

  return (
    <Container size="xl">
      <Transition transition="fade" duration={500} mounted={true}>
        {(styles) => (
          <Title ta="center" mb="lg" order={1} style={styles}>
            Keep the Momentum Going
          </Title>
        )}
      </Transition>
      <Grid gutter={30}>
        {/* Left Column: Main and Secondary Features */}
        <Grid.Col span={8}>
          <Stack gap="lg">
            {/* Main Feature */}
            <Card
              padding="lg"
              style={{ height: "18rem", backgroundColor: "transparent" }}
            >
              <Center style={{ height: "100%" }}>
                {featureDescriptions[selectedFeature].mainContent}
              </Center>
            </Card>

            {/* Secondary Features */}
            <Grid gutter={20} align="center">
              {Object.entries(featureDescriptions).map(([key, feature]) => (
                <Grid.Col span={3} key={key}>
                  <Card
                    withBorder
                    padding="md"
                    onClick={() => rotateFeatures(key)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = theme.shadows.md;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor:
                        selectedFeature === key
                          ? "var(--mantine-color-blue-light-hover)"
                          : "",
                      borderColor:
                        selectedFeature === key
                          ? "var(--mantine-color-blue-light-color)"
                          : "",
                      borderWidth: selectedFeature === key ? "1px" : "",
                      borderStyle: "solid",
                    }}
                  >
                    <Stack align="center" gap="sm">
                      {feature.icon}
                      <Title order={5}>{feature.title}</Title>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>

        <Grid.Col span={4}>
          <Stack gap="sm" pt={"xl"}>
            <Group w="full" align="center" gap="sm">
              {featureDescriptions[selectedFeature].icon}
              <Title order={2} w="full">
                {featureDescriptions[selectedFeature].title}
              </Title>
            </Group>
            <Text c="dimmed">
              {featureDescriptions[selectedFeature].description}
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default FeatureHighlight;
