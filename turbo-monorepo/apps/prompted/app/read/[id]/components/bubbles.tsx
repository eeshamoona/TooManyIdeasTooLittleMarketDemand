"use client";
import React from "react";
import { Box, Badge } from "@mantine/core";

interface WordBubblesProps {
  word_freq: { [key: string]: number };
}

const WordBubbles: React.FC<WordBubblesProps> = ({ word_freq }) => {
  return (
    <Box mt="md" style={{ flexShrink: 0 }}>
      Word Bubbles
      {Object.entries(word_freq).map(([word, freq]) => (
        <Badge
          key={word}
          color="blue"
          variant="light"
          style={{ margin: "0.5rem" }}
        >
          {word} ({freq})
        </Badge>
      ))}
    </Box>
  );
};

export default WordBubbles;
