"use client";
import { useState } from "react";
import { Heading, Box, Text, Button, Textarea, VStack } from "@chakra-ui/react";

const prompts = [
  "Describe your favorite hobby and why you enjoy it.",
  "Write about a memorable trip you took.",
  "What are your thoughts on the future of technology?",
  "Explain a challenging situation you faced and how you overcame it.",
  "Discuss your favorite book and its impact on you.",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");

  const handleGeneratePrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Creative Writing</Heading>
      <VStack spacing={4} align="stretch">
        <Button colorScheme="teal" onClick={handleGeneratePrompt}>
          Get a Writing Prompt
        </Button>
        {prompt && (
          <>
            <Text fontSize="lg" fontWeight="bold">
              {prompt}
            </Text>
            <Textarea
              placeholder="Write about the prompt here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minH="200px"
            />
          </>
        )}
      </VStack>
    </Box>
  );
}
