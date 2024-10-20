"use client";
import { Box, Divider } from "@mantine/core";
import { PromptList } from "../../components/prompt-list";
import { useRouter } from "next/navigation";
import { DisplayProps, Prompt } from "../../components/display";
import { AddPromptForm } from "./add-prompt";
import { useState } from "react";

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
    // TODO: refresh prompts
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
