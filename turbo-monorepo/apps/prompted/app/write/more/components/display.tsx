"use client";
import { Button, Group } from "@mantine/core";
import { PromptList } from "../../components/prompt-list";
import { useRouter } from "next/navigation";
import { DisplayProps } from "../../components/display";
import { AddPromptForm } from "./add-prompt";

export const Display = ({ prompts }: DisplayProps) => {
  const router = useRouter();

  return (
    <>
      <Group mt="xl">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </Group>
      <AddPromptForm />
      <PromptList data={prompts} />
    </>
  );
};
