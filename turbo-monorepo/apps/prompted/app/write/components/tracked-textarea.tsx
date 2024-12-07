import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  TitleOrder,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DiffMatchPatch from "diff-match-patch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconType } from "react-icons";
import { FaBolt, FaLightbulb, FaRedo, FaRegLightbulb } from "react-icons/fa";
import {
  generateCharacterStats,
  getTitleOrder,
  wordFrequencyMap,
} from "../actions";
import { Profile } from "./display";
import { StatsGrid } from "./stats";

const dmp = new DiffMatchPatch();

interface TrackedTextareaProps {
  placeholder?: string;
  promptText: string;
  categoryText: string;
  targetWordCount?: number;
  profile?: Profile;
  onResetPrompt?: () => void;
  Icon?: IconType;
  color?: string;
}

export interface Character {
  type: "AI" | "user";
  value: string;
}

const minTextBoxHeight = "15rem";

export default function TrackedTextarea({
  placeholder = "Write your response here...",
  promptText,
  categoryText,
  targetWordCount,
  profile,
  onResetPrompt,
  Icon,
  color,
}: TrackedTextareaProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [aiCallCount, setAICallCount] = useState<number>(0);
  const [aiLoading, { open: openAi, close: closeAi }] = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [preloadedStats, setPreloadedStats] = useState<any>(null);

  //TODO: Debounce the user input for better performance
  // Ex. const [debounced] = useDebouncedValue(combinedResponse, 200);

  const handleStatsMouseDown = () => {
    setShowStats(true);
  };

  const handleStatsMouseUp = () => {
    setShowStats(false);
  };

  const combinedResponse = characters.map((char) => char.value).join("");

  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (startTime === null) {
      setStartTime(Date.now());
    }

    const newText = e.target.value;

    const diffs = dmp.diff_main(combinedResponse, newText);
    dmp.diff_cleanupSemantic(diffs);

    let newChars: Character[] = [];
    let oldCharIndex = 0;

    diffs.forEach(([operation, text]) => {
      if (operation === DiffMatchPatch.DIFF_EQUAL) {
        for (let i = 0; i < text.length; i++) {
          newChars.push(characters[oldCharIndex]);
          oldCharIndex++;
        }
      } else if (operation === DiffMatchPatch.DIFF_INSERT) {
        for (let i = 0; i < text.length; i++) {
          newChars.push({ type: "user", value: text.charAt(i) });
        }
      } else if (operation === DiffMatchPatch.DIFF_DELETE) {
        oldCharIndex += text.length;
      }
    });

    setCharacters(newChars);
  };

  const generateAIResponse = async (
    currentResponse: string
  ): Promise<string> => {
    try {
      const generateResponse = await fetch("/api/addASentence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: currentResponse,
          prompt: promptText,
        }),
      });
      const data = await generateResponse.json();
      return data.generatedSentence || "";
    } catch (error) {
      console.error("Error calling API:", error);
      return ""; // Return empty string in case of error
    }
  };

  const prepareStats = () => {
    const stats = generateCharacterStats(
      characters,
      combinedResponse,
      targetWordCount
    );
    const { sortedWordFreqDict } = wordFrequencyMap(combinedResponse);
    const uniqueWordCount = Object.keys(sortedWordFreqDict).length;
    const uniqueWordPercentage = (uniqueWordCount / stats.totalWords) * 100;

    stats["uniqueWordCount"] = uniqueWordCount;
    stats["uniqueWordPercentage"] = uniqueWordPercentage;
    stats["aiCallCount"] = aiCallCount;
    const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    stats["elapsedTime"] = elapsedTime;

    return {
      stats,
      sortedWordFreqDict,
    };
  };

  const handleSaveClick = () => {
    const preparedStats = prepareStats();
    setPreloadedStats(preparedStats);
    setShowSaveModal(true);
  };

  const handleClearClick = () => {
    setShowClearModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setShowSaveModal(false);
    const stats = preloadedStats.stats;
    const sortedWordFreqDict = preloadedStats.sortedWordFreqDict;
    let ai_feedback = {};

    // Fetch AI feedback
    try {
      const aiFeedbackData = await fetch("/api/getAiFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: combinedResponse,
          category: categoryText,
          prompt: promptText,
          profile: profile ?? null,
        }),
      });
      const generatedJson = await aiFeedbackData.json();
      ai_feedback = JSON.parse(generatedJson["aiFeedback"]);
    } catch (error) {
      console.error("Error calling API:", error);
    }

    // Save entry
    try {
      const saveResponse = await fetch("/api/saveEntry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: combinedResponse,
          prompt: promptText,
          category: categoryText,
          character_data: characters,
          metadata_stats: stats,
          word_freq: sortedWordFreqDict,
          ai_feedback,
        }),
      });
      const data = await saveResponse.json();
      router.push(`/process/${data.entryId}`);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleConfirmClear = () => {
    setStartTime(null);
    setCharacters([]);
    setShowClearModal(false);
  };

  const handleGenerateClick = async () => {
    openAi();
    try {
      const generatedSentence = await generateAIResponse(combinedResponse);
      closeAi();
      if (generatedSentence) {
        setAICallCount(aiCallCount + 1);
        const aiChars: Character[] = generatedSentence
          .split("")
          .map((char: string) => ({
            type: "AI",
            value: char,
          }));

        setCharacters([...characters, ...aiChars]);
      }
    } catch (error) {
      console.error("Error generating AI sentence:", error);
    }
  };

  const stats = generateCharacterStats(
    characters,
    combinedResponse,
    targetWordCount
  );

  const promptTextLength = promptText.length;

  let titleOrder: TitleOrder = getTitleOrder(promptTextLength);

  return (
    <Stack style={{ width: "100%", height: "100%" }}>
      <Stack flex={1}>
        <Group justify="space-between" align="end">
          {Icon && (
            <Badge
              size="md"
              radius="md"
              variant="light"
              color={color}
              leftSection={<Icon />}
            >
              {categoryText}
            </Badge>
          )}
          <Button
            onClick={onResetPrompt}
            variant="outline"
            color="red"
            size="xs"
            leftSection={<FaRedo size={"0.75rem"} />}
          >
            Reset Prompt
          </Button>
        </Group>
        <Group
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title m={4} flex={1} order={titleOrder}>
            {promptText}
          </Title>
          <Tooltip
            label="Show Stats"
            aria-label="Character stats tooltip"
            position="left"
            withArrow
            color="gray"
            transitionProps={{ transition: "fade" }}
          >
            <ActionIcon
              onMouseEnter={handleStatsMouseDown}
              onMouseLeave={handleStatsMouseUp}
              color={showStats ? "blue" : "gray"}
              disabled={characters.length === 0}
              variant="light"
              size="lg"
            >
              {showStats ? <FaLightbulb /> : <FaRegLightbulb />}
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={
              combinedResponse.length > 100
                ? "Generate AI text"
                : "At least 100 characters required"
            }
            position="right"
            withArrow
            color={combinedResponse.length > 100 ? "blue" : "gray"}
            transitionProps={{ transition: "fade" }}
          >
            <ActionIcon
              loading={aiLoading}
              loaderProps={{ type: "dots", size: "xs" }}
              onClick={handleGenerateClick}
              disabled={combinedResponse.length <= 100}
              variant={"filled"}
              color="blue"
              size="lg"
            >
              <FaBolt />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Box style={{ width: "100%", minHeight: minTextBoxHeight }}>
          {showStats ? (
            <Paper px="12" py="3" mih={minTextBoxHeight}>
              {characters.map((char, index) => (
                <Text
                  span
                  key={index}
                  style={{
                    color:
                      char.type === "AI"
                        ? "var(--mantine-color-blue-light-color)"
                        : "",
                    backgroundColor:
                      char.type === "AI"
                        ? "var(--mantine-color-blue-light-hover)"
                        : "transparent",
                    fontSize:
                      "var(--input-fz, var(--input-fz, var(--mantine-font-size-sm)))",
                  }}
                >
                  {char.value}
                </Text>
              ))}
            </Paper>
          ) : (
            <Textarea
              placeholder={placeholder}
              value={combinedResponse}
              onChange={handleUserInputChange}
              autosize
              minRows={10}
            />
          )}
        </Box>
      </Stack>
      <Stack>
        {showStats && <StatsGrid stats={stats} />}

        <Group grow>
          <Button
            variant="outline"
            onClick={handleClearClick}
            disabled={combinedResponse.trim() === ""}
          >
            Clear
          </Button>
          <Button
            loading={isSaving}
            loaderProps={{ type: "dots" }}
            variant="solid"
            onClick={handleSaveClick}
            disabled={combinedResponse.trim() === ""}
          >
            Save Response
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title={<Text fw="bold"> Save Your Progress 🎉</Text>}
        centered
      >
        {/* Celebrate Message */}
        <Text size="sm">
          Great job on your latest writing! Ready to save your progress?
        </Text>
        <Text size="sm" c="dimmed">
          We'll also send your response to AI for feedback
        </Text>

        {/* Action Buttons */}
        <Group justify="space-between" mt="lg" gap="sm">
          <Button variant="default" onClick={() => setShowSaveModal(false)}>
            Cancel
          </Button>
          <Button
            loading={isSaving}
            loaderProps={{ type: "dots" }}
            onClick={handleConfirmSave}
          >
            Save
          </Button>
        </Group>
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        opened={showClearModal}
        onClose={() => setShowClearModal(false)}
        title={<Text fw="bold"> Clear Writing 🗑️</Text>}
        centered
      >
        <Text size="sm">
          Want to start over? This will action cannot be undone!
        </Text>
        <Text size="sm" c="dimmed">
          The timer will also restart
        </Text>
        <Group justify="space-between" mt="lg">
          <Button variant="outline" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmClear}>
            Clear
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
