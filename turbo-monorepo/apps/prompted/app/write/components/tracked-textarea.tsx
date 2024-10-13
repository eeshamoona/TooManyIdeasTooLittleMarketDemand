import { useState } from "react";
import {
  Textarea,
  Button,
  Box,
  Tooltip,
  Group,
  Stack,
  ActionIcon,
  Paper,
  Title,
} from "@mantine/core";
import { FaHandSparkles, FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import DiffMatchPatch from "diff-match-patch";
import { StatsGrid } from "./stats";
import { useRouter } from "next/navigation";

const dmp = new DiffMatchPatch();

interface TrackedTextareaProps {
  placeholder?: string;
  promptText: string;
  categoryText: string;
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
}: TrackedTextareaProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
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
    currentResponse: string,
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
      ([, a], [, b]) => b - a,
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

  const saveSubmission = async () => {
    console.log("Saving submission...");
    const stats = generateCharacterStats(characters);
    //TODO: Split up the words into a frequency map for the AI to give better suggestions on high frequency words
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

    //TODO: Call AI to get suggestions on high frequency words to get synonyms

    const elapsedTime = startTime ? (Date.now() - startTime) / 1000 : 0; // Calculate elapsed time in seconds
    setStartTime(null);

    // Convert elapsed time to a descriptive format
    let descriptiveTime: string;
    if (elapsedTime >= 60) {
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = Math.floor(elapsedTime % 60);
      descriptiveTime = `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`;
    } else {
      descriptiveTime = `${Math.floor(elapsedTime)} second${elapsedTime !== 1 ? "s" : ""}`;
    }

    stats["elapsedTime"] = descriptiveTime;

    try {
      const saveResponse = await fetch("/api/saveSubmission", {
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
        }),
      });
      const data = await saveResponse.json();
      const submissionId = data.submissionId;
      console.log("Route to submission page with ID:", submissionId);
      //TODO: Re-route to the submission page
      router.push(`/read/${submissionId}`);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleGenerateClick = async () => {
    try {
      const generatedSentence = await generateAIResponse(combinedResponse);
      if (generatedSentence) {
        const aiChars: Character[] = generatedSentence
          .split("")
          .map((char) => ({
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
      (char) => char.type === "user",
    ).length;

    const userPercentage =
      totalCharacters > 0 ? (userCharacters / totalCharacters) * 100 : 0;

    return {
      totalCharacters,
      aiCharacters,
      userCharacters,
      userPercentage: parseFloat(userPercentage.toFixed(2)),
    };
  };

  const handleSaveResponse = () => {
    console.log("Saving response...");

    // TODO: Send the combined response and metadata to the backend here
    saveSubmission();
  };

  const handleSaveAndClearResponse = () => {
    console.log("Clearing response...");
    setStartTime(null);
    setCharacters([]);
  };

  const stats = generateCharacterStats(characters);

  return (
    <Stack style={{ width: "100%" }}>
      <Group style={{ width: "100%", justifyContent: "space-between" }}>
        <Title order={3}>{promptText}</Title>
        {combinedResponse.length > 0 ? (
          <Tooltip
            label="Highlighted sections show AI-generated text"
            aria-label="Character stats tooltip"
            position="right"
            withArrow
            transitionProps={{ transition: "fade" }}
          >
            <ActionIcon
              onMouseEnter={handleStatsMouseDown}
              onMouseLeave={handleStatsMouseUp}
              color={showStats ? "yellow" : "gray"}
              variant="light"
            >
              {showStats ? <FaLightbulb /> : <FaRegLightbulb />}
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>

      <Box style={{ width: "100%", minHeight: minTextBoxHeight }}>
        {showStats ? (
          <Paper>
            {characters.map((char, index) => (
              <span
                key={index}
                style={{
                  backgroundColor:
                    char.type === "AI" ? "yellow" : "transparent",
                }}
              >
                {char.value}
              </span>
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

      <Group grow>
        <Button
          color="red"
          onClick={handleSaveAndClearResponse}
          disabled={combinedResponse.trim() === ""}
        >
          Clear
        </Button>
        <Tooltip
          label="To generate with magic, write at least 100 characters"
          disabled={combinedResponse.length > 100}
          position="bottom"
          withArrow
          transitionProps={{ transition: "fade" }}
        >
          <ActionIcon
            color="yellow"
            onClick={handleGenerateClick}
            disabled={combinedResponse.length <= 100}
            size="lg"
          >
            <FaHandSparkles />
          </ActionIcon>
        </Tooltip>
        <Button
          color="green"
          onClick={handleSaveResponse}
          disabled={combinedResponse.trim() === ""}
        >
          Save Response
        </Button>
      </Group>

      {showStats && <StatsGrid stats={stats} />}
    </Stack>
  );
}
