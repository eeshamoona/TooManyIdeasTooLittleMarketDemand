"use client";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Title,
  Text,
  Divider,
  Badge,
} from "@mantine/core";
import { useState } from "react";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { Character } from "../../../write/components/tracked-textarea";
import { useRouter } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";
import { StatsProps } from "./stats-grid";
import { NEW_PROMPT_CATEGORIES } from "../../../write/interface";
import { convertTimeToDescription } from "../../../write/actions";

interface DisplayTextProps {
  data: {
    metadata_stats: StatsProps;
    text: string;
    character_data: Character[];
    word_freq: { [key: string]: number };
    prompt: string;
    category: string;
    created_at: string;
  };
  username: string;
}

export default function DisplayText({ data, username }: DisplayTextProps) {
  const [showAIParts, setShowAIParts] = useState(true);
  const router = useRouter();

  const handleToggleStats = () => {
    setShowAIParts((prev) => !prev);
  };

  const category = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === data.category
  );
  const Icon = category?.icon;
  const color = `var(--mantine-color-${category?.color}-5)`;

  return (
    <Container h="100%">
      <Box
        my={"md"}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outline"
          leftSection={<LuLayoutDashboard />}
          onClick={() => router.push("/read")}
        >
          View All
        </Button>
        <ActionIcon
          onClick={handleToggleStats}
          color={!showAIParts ? "grape" : "gray"}
          variant="light"
        >
          {showAIParts ? <FaLightbulb /> : <FaRegLightbulb />}
        </ActionIcon>
      </Box>
      <Title order={2}>{data.prompt}</Title>
      <Group justify="space-between" mt={"xs"} mb="md">
        <Group justify="start">
          <Text size="sm" c="dimmed">
            By {username}
          </Text>
          <Divider orientation="vertical" m={0} />
          <Text size="sm" c="dimmed">
            {new Date(data.created_at).toLocaleDateString()}
          </Text>
          <Divider orientation="vertical" m={0} />
          <Text size="sm" c="dimmed">
            Completed in{" "}
            {convertTimeToDescription(data.metadata_stats.elapsedTime)}
          </Text>
        </Group>
        {Icon && (
          <Badge
            size="md"
            radius="md"
            variant="light"
            color={color}
            leftSection={<Icon />}
          >
            {data.category}
          </Badge>
        )}
      </Group>
      <Box style={{ flex: 1, overflow: "auto", maxHeight: "70%" }}>
        <Paper my="md" mb="lg" style={{ height: "100%", overflowY: "auto" }}>
          {showAIParts ? (
            <div>{data.text}</div>
          ) : (
            data.character_data.map((char: Character, index: number) => (
              <span
                key={index}
                style={{
                  color:
                    char.type === "AI"
                      ? "var(--mantine-color-grape-light-color)"
                      : "",
                  backgroundColor:
                    char.type === "AI"
                      ? "var(--mantine-color-grape-light-hover)"
                      : "transparent",
                }}
              >
                {char.value}
              </span>
            ))
          )}
        </Paper>
      </Box>
    </Container>
  );
}
