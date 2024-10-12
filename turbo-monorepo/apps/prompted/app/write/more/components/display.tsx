"use client";
import { Button, Divider, Group } from "@mantine/core";
import { PromptList } from "../../components/prompt-list";
import { useRouter } from "next/navigation";
import { DisplayProps } from "../../components/display";
import { AddPromptForm } from "./add-prompt";
import { FaArrowLeft } from "react-icons/fa";

export const Display = ({ prompts }: DisplayProps) => {
  const router = useRouter();

  return (
    <>
      <Group mt="xl">
        <Button
          variant="outline"
          leftSection={<FaArrowLeft />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Group>
      <AddPromptForm />
      <Divider my={12} />
      <PromptList data={prompts} />
    </>
  );
};
