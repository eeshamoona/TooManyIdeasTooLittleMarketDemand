"use client";
import { Box, Divider } from "@mantine/core";
import { useState } from "react";
import { DisplayProps, Prompt } from "../../components/display";
import { PromptList } from "../../components/prompt-list";
import { AiAddPromptForm } from "./ai-add-prompt";

export const Display2 = ({ prompts }: DisplayProps) => {
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);

  const handleCategorySelected = (category: string | null) => {
    if (category === null) {
      setFilteredPrompts(prompts);
    } else {
      const filtered = prompts.filter((prompt) => prompt.category === category);
      setFilteredPrompts(filtered);
    }
  };

  return (
    <Box>
      <AiAddPromptForm
        onCategorySelected={handleCategorySelected}
        prompts={prompts}
      />
      <Divider my={11} />

      <PromptList data={filteredPrompts} />
    </Box>
  );
};
