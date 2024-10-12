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

interface DisplayTextProps {
  data: {
    metadata_stats: StatsProps;
    text: string;
    character_data: Character[];
    word_freq: { [key: string]: number };
    prompt: string;
    category: string;
  };
  username: string;
}

export default function DisplayText({ data, username }: DisplayTextProps) {
  const [showAIParts, setShowAIParts] = useState(true);
  const router = useRouter();

  const handleToggleStats = () => {
    setShowAIParts((prev) => !prev);
  };

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
          color={!showAIParts ? "yellow" : "gray"}
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
            Completed in {data.metadata_stats.elapsedTime}
          </Text>
        </Group>
        <Badge variant="light" color="blue" radius="sm">
          {data.category}
        </Badge>
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
                  backgroundColor:
                    char.type === "AI" ? "yellow" : "transparent",
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
