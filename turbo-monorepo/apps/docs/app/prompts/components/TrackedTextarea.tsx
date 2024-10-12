import { useState } from "react";
import {
  VStack,
  Textarea,
  Button,
  HStack,
  IconButton,
  Text,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import DiffMatchPatch from "diff-match-patch";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { Stat, StatLabel, StatNumber, StatGroup } from "@chakra-ui/react";

const dmp = new DiffMatchPatch();

interface TrackedTextareaProps {
  // eslint-disable-next-line no-unused-vars
  generate: (string) => Promise<string>;
  placeholder?: string;
  promptText: string;
}

export interface Character {
  type: "AI" | "user";
  value: string;
}

const minTextBoxHeight = "15rem";

export default function TrackedTextarea({
  generate,
  placeholder = "Write your response here...",
  promptText,
}: TrackedTextareaProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showStats, setShowStats] = useState(false);

  const handleStatsMouseDown = () => {
    setShowStats(true);
  };

  const handleStatsMouseUp = () => {
    setShowStats(false);
  };
  const combinedResponse = characters.map((char) => char.value).join("");

  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    // Compute the differences between the combined response and the new text
    const diffs = dmp.diff_main(combinedResponse, newText);
    dmp.diff_cleanupSemantic(diffs);

    let newChars: Character[] = [];
    let oldCharIndex = 0;

    // Iterate through the differences
    diffs.forEach(([operation, text]) => {
      if (operation === DiffMatchPatch.DIFF_EQUAL) {
        // If the text is equal in both versions, retain the existing characters
        for (let i = 0; i < text.length; i++) {
          newChars.push(characters[oldCharIndex]);
          oldCharIndex++;
        }
      } else if (operation === DiffMatchPatch.DIFF_INSERT) {
        // If new text is inserted, mark the characters as user input
        for (let i = 0; i < text.length; i++) {
          newChars.push({ type: "user", value: text.charAt(i) });
        }
      } else if (operation === DiffMatchPatch.DIFF_DELETE) {
        // If text is deleted, skip the corresponding characters in the old text
        oldCharIndex += text.length;
      }
    });

    // Update the characters state with the new characters array
    setCharacters(newChars);
  };

  const handleGenerateClick = async () => {
    try {
      const generatedSentence = await generate(combinedResponse);
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

  // Function to generate statistics from character metadata
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
      userPercentage: userPercentage.toFixed(2), // Format to 2 decimal places
    };
  };

  const handleSaveResponse = () => {
    console.log("Combined Response:", combinedResponse);

    const stats = generateCharacterStats(characters);
    console.log("Character Stats:", stats);

    //TODO: Send the combined response and metadata to the backend here
  };

  const handleSaveAndClearResponse = () => {
    // handleSaveResponse();
    setCharacters([]);
  };

  const stats = generateCharacterStats(characters);
  const getUserPercentageColor = (percentage) => {
    if (percentage < 33) return "red.500";
    if (percentage < 66) return "yellow.500";
    return "green.500";
  };

  return (
    <VStack spacing={4} w="full">
      <HStack w={"full"}>
        <Text fontSize="xl" fontWeight="bold" width={"full"}>
          {promptText}
        </Text>
        <Tooltip
          label="Highlighted sections show AI-generated text"
          aria-label="Character stats tooltip"
          bg="blue.100"
          color="black"
          fontSize="xs"
          borderRadius="md"
          hasArrow
          placement="right"
        >
          <IconButton
            icon={showStats ? <FaLightbulb /> : <FaRegLightbulb />}
            aria-label="Toggle View"
            onMouseEnter={handleStatsMouseDown}
            onMouseLeave={handleStatsMouseUp}
            variant={"unstyled"}
            mb={4}
            color={showStats ? "yellow.400" : "gray.800"}
          />
        </Tooltip>
      </HStack>
      <Box w="full" minH={minTextBoxHeight}>
        {showStats ? (
          <Box
            px={4}
            py={2}
            lineHeight={"short"}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            minH={minTextBoxHeight}
          >
            {characters.map((char, index) => (
              <span
                key={index}
                style={{
                  backgroundColor:
                    char.type === "AI" ? "yellow" : "transparent",
                  color: "inherit", // Keep the text color normal
                }}
              >
                {char.value}
              </span>
            ))}
          </Box>
        ) : (
          <Textarea
            placeholder={placeholder}
            value={combinedResponse}
            onChange={handleUserInputChange}
            rows={10}
          />
        )}
      </Box>
      <HStack w={"100%"}>
        <Button
          colorScheme="red"
          flex={3}
          onClick={handleSaveAndClearResponse}
          disabled={combinedResponse.trim() === ""}
        >
          Clear
        </Button>
        <Tooltip
          label="To generate with magic, write at least 100 characters"
          aria-label="Magic generation note"
          isDisabled={combinedResponse.length > 100}
          bg="blue.100"
          color="black"
          fontSize="xs"
          borderRadius="md"
          p={1}
          hasArrow
          placement="bottom"
        >
          <IconButton
            flex={1}
            colorScheme="yellow"
            icon={<FaWandMagicSparkles />}
            aria-label="Sparkle"
            disabled={combinedResponse.length <= 100}
            onClick={handleGenerateClick}
          />
        </Tooltip>
        <Button
          colorScheme="green"
          flex={3}
          onClick={handleSaveResponse}
          disabled={combinedResponse.trim() === ""}
        >
          Save Response
        </Button>
      </HStack>

      {showStats && (
        <Box w="full" mt={4} p={4} borderWidth={1} borderRadius="md">
          <StatGroup>
            <Stat>
              <StatLabel>Total Characters</StatLabel>
              <StatNumber>{stats.totalCharacters}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>AI Characters</StatLabel>
              <StatNumber>{stats.aiCharacters}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>User Characters</StatLabel>
              <StatNumber>{stats.userCharacters}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>User Percentage</StatLabel>
              <StatNumber color={getUserPercentageColor(stats.userPercentage)}>
                {stats.userPercentage}%
              </StatNumber>
            </Stat>
          </StatGroup>
        </Box>
      )}
    </VStack>
  );
}
