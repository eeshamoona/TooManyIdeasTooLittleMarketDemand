"use client";
import { Box } from "@mantine/core";
import { PromptList } from "../../components/prompt-list";
import { DisplayProps, Prompt } from "../../components/display";
import { useState } from "react";
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
    <Box pt="xl">
      <AiAddPromptForm
        onCategorySelected={handleCategorySelected}
        prompts={prompts}
      />
      <PromptList data={filteredPrompts} />
    </Box>
  );
};
