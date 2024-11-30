"use client";
import { Box, Divider } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DisplayProps, Prompt } from "../../components/display";
import { PromptList } from "../../components/prompt-list";
import { AddPromptForm } from "./add-prompt";

export const Display = ({ prompts }: DisplayProps) => {
  const router = useRouter();
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);

  const handleCategorySelected = (category: string | null) => {
    if (category === null) {
      setFilteredPrompts(prompts);
    } else {
      const filtered = prompts.filter((prompt) => prompt.category === category);
      setFilteredPrompts(filtered);
    }
  };

  const handleOnPromptAdded = () => {
    router.refresh();
    setFilteredPrompts(prompts);
  };

  return (
    <Box>
      <AddPromptForm
        onCategorySelected={handleCategorySelected}
        onPromptAdded={handleOnPromptAdded}
      />
      <Divider my={12} />
      <PromptList data={filteredPrompts} />
    </Box>
  );
};
