"use client";
import { Box, Divider } from "@mantine/core";
import { PromptList } from "../../components/prompt-list";
import { Prompt } from "../../components/display";
import { useState } from "react";
import { AiAddPromptForm } from "./ai-add-prompt";

type Display2Props = {
  prompts: Prompt[];
};

export const Display2 = ({ prompts }: Display2Props) => {
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
