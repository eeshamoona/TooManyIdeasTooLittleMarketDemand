"use client";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Paper,
  Title,
  Text,
  Divider,
  Badge,
  Flex,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { Character } from "../../../write/components/tracked-textarea";
import { useRouter } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";
import { StatsProps } from "./stats-grid";
import { NEW_PROMPT_CATEGORIES } from "../../../write/interface";
import { convertTimeToDescription } from "../../../write/actions";
import { RiBubbleChartLine } from "react-icons/ri";
import { RiBubbleChartFill } from "react-icons/ri";
import MatterCircles from "./bubbles";

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
  const [showAIParts, setShowAIParts] = useState(false);
  const [showWordFreq, setShowWordFreq] = useState(false);
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const handleToggleStats = () => {
    if (showWordFreq) {
      setShowWordFreq(false);
    }
    setShowAIParts((prev) => !prev);
  };

  const handleToggleWordFreq = () => {
    if (showAIParts) {
      setShowAIParts(false);
    }
    setShowWordFreq((prev) => !prev);
  };

  const category = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === data.category,
  );
  const Icon = category?.icon;
  const color = `var(--mantine-color-${category?.color}-5)`;

  return (
    <Flex direction={"column"} style={{ height: "100%" }}>
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
        <ActionIcon.Group variant="subtle">
          {data.metadata_stats.aiCallCount > 0 && (
            <ActionIcon
              onClick={handleToggleStats}
              color={showAIParts ? "grape" : "gray"}
              variant="subtle"
            >
              {showAIParts ? <FaLightbulb /> : <FaRegLightbulb />}
            </ActionIcon>
          )}
          <ActionIcon
            onClick={handleToggleWordFreq}
            color={!showWordFreq ? "gray" : "blue"}
            variant="subtle"
          >
            {showWordFreq ? <RiBubbleChartFill /> : <RiBubbleChartLine />}
          </ActionIcon>
        </ActionIcon.Group>
      </Box>
      <Title order={2}>{data.prompt}</Title>
      <Group justify="space-between" mt={"xs"} mb="md" align="center">
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
      <Box style={{ flex: 1, overflow: "auto" }}>
        {showWordFreq ? (
          <MatterCircles word_freq={data.word_freq} colorScheme={colorScheme} />
        ) : (
          <Paper style={{ height: "100%", overflowY: "auto" }}>
            {!showAIParts
              ? data.text
              : data.character_data.map((char: Character, index: number) => (
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
                ))}
          </Paper>
        )}
      </Box>
    </Flex>
  );
}
