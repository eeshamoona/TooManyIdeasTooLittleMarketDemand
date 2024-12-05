import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
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
import { getTitleOrder } from "../actions";
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

  const wordFrequencyMap = (text: string) => {
    // Convert the text to lowercase and remove punctuation
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, "");

    // Split the text into individual words
    const words = cleanText.split(/\s+/).filter((word) => word !== "");

    // Calculate the total number of words
    const totalWords = words.length;

    // Create a word frequency dictionary
    const wordFreq: { [word: string]: number } = {};

    words.forEach((word) => {
      if (wordFreq[word]) {
        wordFreq[word]++;
      } else {
        wordFreq[word] = 1;
      }
    });

    // Convert the dictionary to an array of tuples [word, frequency]
    const sortedWordFreq = Object.entries(wordFreq).sort(
      ([, a], [, b]) => b - a
    );

    // Convert back to an object and return
    const sortedWordFreqDict: { [word: string]: number } = {};
    sortedWordFreq.forEach(([word, freq]) => {
      sortedWordFreqDict[word] = freq;
    });

    // Get the top 10 most commonly used words
    const top10Words = sortedWordFreq.slice(0, 10);

    return { sortedWordFreqDict, totalWords, top10Words };
  };

  const saveEntry = async () => {
    setIsSaving(true);
    const stats = generateCharacterStats(characters);
    const { sortedWordFreqDict, totalWords, top10Words } =
      wordFrequencyMap(combinedResponse);

    const uniqueWordCount = Object.keys(sortedWordFreqDict).length;
    const uniqueWordPercentage = (uniqueWordCount / totalWords) * 100;

    // Get the top 10 most commonly used words
    console.log("Top 10 most words:", top10Words);

    //Append sortedWordFreqDict, totalWords, top10Words to stats object
    stats["totalWords"] = totalWords;
    stats["uniqueWordCount"] = uniqueWordCount;
    stats["uniqueWordPercentage"] = uniqueWordPercentage;
    stats["aiCallCount"] = aiCallCount;

    const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    setStartTime(null);
    stats["elapsedTime"] = elapsedTime;
    let ai_feedback = {};

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
      console.log("Raw AI Feedback Data:", generatedJson);

      try {
        ai_feedback = JSON.parse(generatedJson["aiFeedback"]);
        console.log("Parsed AI Feedback JSON:", ai_feedback);
      } catch (error) {
        console.error("Error parsing AI Feedback JSON:", error);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }

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
      const entry_id = data.entryId;
      console.log("Route to entry page with ID:", entry_id);
      router.push(`/process/${entry_id}`);
    } catch (error) {
      console.error("Error calling API:", error);
    }
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

  const generateCharacterStats = (characters: Character[]) => {
    const totalCharacters = characters.length;
    const aiCharacters = characters.filter((char) => char.type === "AI").length;
    const userCharacters = characters.filter(
      (char) => char.type === "user"
    ).length;

    const userPercentage =
      totalCharacters > 0 ? (userCharacters / totalCharacters) * 100 : 0;

    const wordCount = combinedResponse.trim().split(/\s+/).length;
    const aiWordCount = combinedResponse
      .split(/\s+/)
      .filter((_, index, array) => {
        const startIndex =
          array.slice(0, index + 1).join(" ").length - array[index].length;
        return characters[startIndex]?.type === "AI";
      }).length;

    return {
      totalCharacters,
      aiCharacters,
      userCharacters,
      userPercentage: parseFloat(userPercentage.toFixed(2)),
      wordCount,
      targetWordCount: targetWordCount ?? null,
      aiWordCount,
    };
  };

  const handleSaveAndClearResponse = () => {
    console.log("Clearing response...");
    setStartTime(null);
    setCharacters([]);
  };

  const stats = generateCharacterStats(characters);

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
            onClick={handleSaveAndClearResponse}
            disabled={combinedResponse.trim() === ""}
          >
            Clear
          </Button>
          <Button
            loading={isSaving}
            loaderProps={{ type: "dots" }}
            variant="solid"
            onClick={saveEntry}
            disabled={combinedResponse.trim() === ""}
          >
            Save Response
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}
