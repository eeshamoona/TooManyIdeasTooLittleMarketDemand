"use client";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Title,
  Text,
  useMantineColorScheme,
  Tooltip,
  Paper,
  Switch,
} from "@mantine/core";
import { useState } from "react";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { Character } from "../../../write/components/tracked-textarea";
import { useRouter } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";
import { StatsProps } from "./stats-grid";
import { convertTimeToDescription } from "../../../write/actions";
import { NEW_PROMPT_CATEGORIES } from "../../../write/interface";
import { RiBubbleChartLine } from "react-icons/ri";
import { RiBubbleChartFill } from "react-icons/ri";
import MatterCircles from "./bubbles";
import Info from "./info";

interface DisplayTextProps {
  data: {
    id: string;
    metadata_stats: StatsProps;
    text: string;
    character_data: Character[];
    word_freq: { [key: string]: number };
    prompt: string;
    category: string;
    created_at: string;
    ai_feedback: any;
  };
  username: string;
}
const STOP_WORDS = [
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "in",
  "on",
  "with",
  "at",
  "for",
  "to",
  "from",
  "by",
  "this",
  "that",
  "these",
  "those",
];

export default function DisplayText({ data }: DisplayTextProps) {
  const [showAIParts, setShowAIParts] = useState(false);
  const [showWordFreq, setShowWordFreq] = useState(false);
  const [showCleanWordFreq, setShowCleanWordFreq] = useState<boolean>(false);

  // Function to filter out useless words
  function cleanWordFreq(wordFreq: { [key: string]: number }): {
    [key: string]: number;
  } {
    const minLength = 4; // Set a minimum word length

    return Object.keys(wordFreq)
      .filter(
        (word) =>
          !STOP_WORDS.includes(word.toLowerCase()) && // Remove stop words
          word.length >= minLength, // Remove short words
      )
      .reduce((filtered: { [key: string]: number }, word) => {
        filtered[word] = wordFreq[word]; // Rebuild filtered word frequency object
        return filtered;
      }, {});
  }

  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const handleToggleAiParts = () => {
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

  const Header = () => (
    <>
      <Title order={2}>{data.prompt}</Title>
      <Group justify="space-between" my="sm" align="center">
        <Group justify="start" align="center">
          <Text size="sm" c="dimmed">
            {new Date(data.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
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
    </>
  );

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCleanWordFreq(event.currentTarget.checked);
  };

  const getWordFreq = showCleanWordFreq
    ? cleanWordFreq(data.word_freq)
    : data.word_freq;

  const Body = () => {
    return (
      <>
        {showWordFreq ? (
          <div
            style={{
              height: "100%",
              marginTop: "1rem",
            }}
          >
            <MatterCircles word_freq={getWordFreq} colorScheme={colorScheme} />

            <Switch
              label={"Show Interesting Words"}
              checked={showCleanWordFreq}
              onChange={handleToggleChange}
              mt="sm"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            />
          </div>
        ) : (
          <Box
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Paper style={{ height: "100%", overflowY: "auto" }}>
              {!showAIParts
                ? data.text
                : data.character_data.map((char, index) => (
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
            <Box>
              <Info
                entry={{
                  metadata_stats: data.metadata_stats,
                  ai_feedback: data.ai_feedback,
                  id: data.id,
                  text: data.text,
                  category: data.category,
                  prompt: data.prompt,
                }}
              />
            </Box>
          </Box>
        )}
      </>
    );
  };

  return (
    <>
      <Box
        mt={"md"}
        mb="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <Button
          variant="outline"
          leftSection={<LuLayoutDashboard />}
          onClick={() => router.push("/read")}
        >
          View All
        </Button>
        <Group justify="end">
          <ActionIcon.Group variant="subtle">
            <Tooltip
              label={
                data.metadata_stats.aiCallCount <= 0
                  ? "No AI to show!"
                  : "Show AI parts"
              }
              position="left"
            >
              <ActionIcon
                onClick={handleToggleAiParts}
                disabled={data.metadata_stats.aiCallCount <= 0}
                color={!showAIParts ? "gray" : "grape"}
                variant="subtle"
              >
                {showAIParts ? <FaLightbulb /> : <FaRegLightbulb />}
              </ActionIcon>
            </Tooltip>

            <ActionIcon
              onClick={handleToggleWordFreq}
              color={!showWordFreq ? "gray" : "orange"}
              variant="subtle"
            >
              {showWordFreq ? <RiBubbleChartFill /> : <RiBubbleChartLine />}
            </ActionIcon>
          </ActionIcon.Group>
        </Group>
      </Box>
      <Header />

      <Body />
    </>
  );
}
