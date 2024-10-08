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
    //TODO: Determine if the response should be cut down and to what length
    const getTrimmedResponse = () => {
      return response.length > 500 ? response.slice(-500) : response;
    };

    try {
      console.log("Calling API...", getTrimmedResponse());
      const generateResponse = await fetch("/api/addASentence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: getTrimmedResponse(),
          prompt: prompt.text,
        }),
      });
      const data = await generateResponse.json();
      const { generatedSentence } = data;
      if (generatedSentence) {
        const newResponse = response + " " + generatedSentence;
        setResponse(newResponse);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <VStack spacing={4} w="full">
      <Text fontSize="xl" fontWeight="bold" width={"full"}>
        {prompt.text}
      </Text>

      <Textarea
        placeholder="Write your response here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={10}
      />

      <HStack w={"100%"}>
        <Button
          colorScheme="red"
          flex={3}
          onClick={handleSaveAndClearResponse}
          disabled={response === ""}
        >
          Clear
        </Button>
        <IconButton
          flex={1}
          colorScheme="yellow"
          icon={<FaWandMagicSparkles />}
          aria-label="Sparkle"
          disabled={response.length <= 100}
          onClick={handleSparkleClick}
        />
        <Button colorScheme="green" flex={3} onClick={handleSaveResponse}>
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
