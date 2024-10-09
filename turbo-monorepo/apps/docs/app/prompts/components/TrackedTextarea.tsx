import { useState } from "react";
import {
  VStack,
  Textarea,
  Button,
  HStack,
  IconButton,
  Text,
  Box,
} from "@chakra-ui/react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import DiffMatchPatch from "diff-match-patch";

const dmp = new DiffMatchPatch();

interface TrackedTextareaProps {
  // eslint-disable-next-line no-unused-vars
  generate: (string) => Promise<string>;
  placeholder?: string;
  promptText: string;
}

interface Character {
  type: "AI" | "user";
  value: string;
}

export default function TrackedTextarea({
  generate,
  placeholder = "Write your response here...",
  promptText,
}: TrackedTextareaProps) {
  const [characters, setCharacters] = useState<Character[]>([]);

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
      (char) => char.type === "user"
    ).length;

    // Calculate the percentage of user-generated characters
    const userPercentage =
      totalCharacters > 0 ? (userCharacters / totalCharacters) * 100 : 0;

    return {
      totalCharacters,
      aiCharacters,
      userCharacters,
      userPercentage: userPercentage.toFixed(2), // Format to 2 decimal places
    };
  };

  // Example usage of the function
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

  return (
    <VStack spacing={4} w="full">
      <Text fontSize="xl" fontWeight="bold" width={"full"}>
        {promptText}
      </Text>
      <Textarea
        placeholder={placeholder}
        value={combinedResponse}
        onChange={handleUserInputChange}
        rows={10}
      />
      <HStack w={"100%"}>
        <Button
          colorScheme="red"
          flex={3}
          onClick={handleSaveAndClearResponse}
          disabled={combinedResponse.trim() === ""}
        >
          Clear
        </Button>
        <IconButton
          flex={1}
          colorScheme="yellow"
          icon={<FaWandMagicSparkles />}
          aria-label="Sparkle"
          disabled={combinedResponse.length <= 100}
          onClick={handleGenerateClick}
        />
        <Button colorScheme="green" flex={3} onClick={handleSaveResponse}>
          Save Response
        </Button>
      </HStack>
      {combinedResponse.length <= 100 && (
        <Text color="red.500" fontSize="sm">
          To generate with magic, write at least 100 characters
        </Text>
      )}
      <Box>
        {characters.map((char, index) => (
          <span
            key={index}
            style={{
              backgroundColor: char.type === "AI" ? "yellow" : "transparent",
              color: "inherit", // Keep the text color normal
            }}
          >
            {char.value}
          </span>
        ))}
      </Box>
    </VStack>
  );
}
