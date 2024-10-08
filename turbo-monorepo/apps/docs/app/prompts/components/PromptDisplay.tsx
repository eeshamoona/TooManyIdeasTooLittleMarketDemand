"use client";
import {
  VStack,
  Text,
  Textarea,
  Button,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";

export default function PromptDisplay({ prompt }) {
  const [response, setResponse] = useState("");

  const handleSaveResponse = () => {
    console.log(response);
  };

  const handleSaveAndClearResponse = () => {
    console.log(response);
    setResponse("");
  };

  const handleSparkleClick = async () => {
    //Get the last 100 characters of the response but make sure to include full sentences
    const last100Chars = response.slice(-100);

    try {
      const generatedSentence = await fetch("/api/addASentence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: last100Chars, prompt: prompt.text }),
      });
      const data = await generatedSentence.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <VStack spacing={4} margin="0 auto">
      <Text fontSize="xl" fontWeight="bold" width={"full"}>
        {prompt.text}
      </Text>

      <Textarea
        placeholder="Write your response here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={6}
      />

      <HStack w={"100%"}>
        <Button
          colorScheme="red"
          flex={1}
          onClick={handleSaveAndClearResponse}
          disabled={response === ""}
        >
          Clear
        </Button>
        <IconButton
          colorScheme="yellow"
          icon={<FaWandMagicSparkles />}
          aria-label="Sparkle"
          disabled={response.length <= 100}
          onClick={handleSparkleClick}
        />
        <Button colorScheme="green" flex={1} onClick={handleSaveResponse}>
          Save Response
        </Button>
      </HStack>
      {response.length <= 100 && (
        <Text color="red.500" fontSize="sm">
          To generate with magic, write at least 100 characters
        </Text>
      )}
    </VStack>
  );
}
