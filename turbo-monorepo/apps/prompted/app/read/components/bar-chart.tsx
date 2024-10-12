import React from "react";
import { Flex, Progress, Tooltip, Text } from "@mantine/core";

interface StatProgressProps {
  totalCharacters: number;
  userCharacters: number;
  aiCharacters: number;
  userPercentage: number;
  uniqueWordCount: number;
  uniqueWordPercentage: number;
  totalWords: number;
}

const getPercentageColor = (percentage: number) => {
  if (percentage > 66) return "green";
  if (percentage > 33) return "yellow";
  return "red";
};

const StatProgress: React.FC<StatProgressProps> = ({
  totalCharacters,
  userCharacters,
  aiCharacters,
  userPercentage,
  uniqueWordCount,
  uniqueWordPercentage,
  totalWords,
}) => {
  const commonWords = totalWords - uniqueWordCount;
  return (
    <>
      <Flex mt="sm" gap={"sm"} align={"center"}>
        <Text fw={"bold"}>Total Characters:</Text>
        <Text>{totalCharacters}</Text>
      </Flex>
      <Progress.Root size="xl">
        <Tooltip label={`${userCharacters} characters`} position="bottom">
          <Progress.Section
            value={userCharacters}
            bg={getPercentageColor(userPercentage)}
          >
            <Progress.Label>User</Progress.Label>
          </Progress.Section>
        </Tooltip>

        <Tooltip label={`${aiCharacters} characters`} position="bottom">
          <Progress.Section
            value={aiCharacters}
            color="var(--mantine-color-gray-dark-hover)"
          >
            <Progress.Label c="gray">AI</Progress.Label>
          </Progress.Section>
        </Tooltip>
      </Progress.Root>

      <Flex mt="sm" gap={"sm"} align={"center"}>
        <Text fw={"bold"}>Total Words:</Text>
        <Text>{totalWords}</Text>
      </Flex>
      <Progress.Root size="xl">
        <Tooltip label={`${uniqueWordCount} unique words`} position="bottom">
          <Progress.Section
            value={uniqueWordPercentage}
            color={getPercentageColor(uniqueWordPercentage)} // Changed 'bg' to 'color'
          >
            <Progress.Label>Unique</Progress.Label>
          </Progress.Section>
        </Tooltip>

        <Tooltip label={`${commonWords} common words`} position="bottom">
          <Progress.Section
            value={100 - uniqueWordPercentage}
            color="var(--mantine-color-gray-dark-hover)"
          >
            <Progress.Label color="gray">Common</Progress.Label>
          </Progress.Section>
        </Tooltip>
      </Progress.Root>
    </>
  );
};

export default StatProgress;
