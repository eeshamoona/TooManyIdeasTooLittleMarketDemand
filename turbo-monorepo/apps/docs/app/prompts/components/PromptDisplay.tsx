// app/prompts/components/PromptDisplay.tsx
"use client";

import { VStack, Text, Textarea, Button } from "@chakra-ui/react";
import { useState } from "react";

export default function PromptDisplay({ prompt }) {
  const [response, setResponse] = useState("");

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="xl" fontWeight="bold">
        {prompt.text}
      </Text>

      <Textarea
        placeholder="Write your response here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={6}
      />

      <Button colorScheme="teal" onClick={() => console.log(response)}>
        Save Response
      </Button>
    </VStack>
  );
}
