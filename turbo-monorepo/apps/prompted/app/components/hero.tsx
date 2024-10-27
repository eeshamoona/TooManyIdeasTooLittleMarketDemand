"use client";
import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Grid,
  rem,
  Flex,
} from "@mantine/core";
import image from "../../public/Creative writing-pana.png";
import { FaCheck } from "react-icons/fa";
import { subtext } from "./data";

interface HeroPageProps {
  answerQ1?: string;
  scrollToCallback: () => void;
  goToLoginCallback: () => void;
}
export default function HeroPage({
  answerQ1,
  scrollToCallback,
  goToLoginCallback,
}: HeroPageProps) {
  const getSubtext = () => {
    switch (answerQ1) {
      case "A":
        return subtext[1];
      case "B":
        return subtext[2];
      case "C":
        return subtext[3];
      case "D":
        return subtext[4];
      default:
        return subtext[0];
    }
  };

  return (
    <Container size="lg" pt={"5rem"}>
      <Grid gutter="xl" align="center">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="md">Welcome to your space for</Text>
          <Title order={1}> Effortless Writing, Creativity, and Growth</Title>
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={{ base: "sm", sm: "lg" }}
            justify={{ sm: "space-between" }}
            mb="xl"
          >
            <Text size="md" c="dimmed" mt="md">
              {getSubtext()}
            </Text>
          </Flex>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <FaCheck style={{ width: rem(12), height: rem(12) }} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Completely Free</b> – No hidden fees, no premium features.
            </List.Item>
            <List.Item>
              <b>AI Powered</b> – OpenAI's GPT-4o Mini will help you when you
              get stuck.
            </List.Item>
            <List.Item>
              <b>Gamified</b> – See stats, earn badges, and level up your
              writing skills.
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="sm" size="md" onClick={goToLoginCallback}>
              Start Writing
            </Button>
            <Button
              variant="default"
              radius="sm"
              size="md"
              onClick={scrollToCallback}
            >
              How It Works
            </Button>
          </Group>
        </Grid.Col>

        {/* Image Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image src={image.src} alt="Creative Space" fit="contain" />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
