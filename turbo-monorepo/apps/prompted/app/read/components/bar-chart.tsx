import React from "react";
import {
  Flex,
  Progress,
  Tooltip,
  Text,
  useMantineColorScheme,
} from "@mantine/core";

interface StatProgressProps {
  totalCharacters: number;
  userCharacters: number;
  aiCharacters: number;
  userPercentage: number;
  uniqueWordCount: number;
  uniqueWordPercentage: number;
  totalWords: number;
}

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
  const { colorScheme } = useMantineColorScheme();
  const otherColor =
    colorScheme === "dark"
      ? "var(--mantine-color-gray-dark-hover)"
      : "var(--mantine-color-gray-1)";

  const textColor = colorScheme === "dark" ? "white" : "dark";

  const getPercentageColor = (percentage: number) => {
    if (percentage > 66)
      return colorScheme === "dark"
        ? "var(--mantine-color-green-8)"
        : "var(--mantine-color-green-3)";
    if (percentage > 33)
      return colorScheme === "dark"
        ? "var(--mantine-color-yellow-8)"
        : "var(--mantine-color-yellow-3)";
    return colorScheme === "dark"
      ? "var(--mantine-color-red-8)"
      : "var(--mantine-color-red-2)";
  };
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
            <Progress.Label c={textColor}>User</Progress.Label>
          </Progress.Section>
        </Tooltip>

        <Tooltip label={`${aiCharacters} characters`} position="bottom">
          <Progress.Section value={aiCharacters} color={otherColor}>
            <Progress.Label c={textColor}>AI</Progress.Label>
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
            color={getPercentageColor(uniqueWordPercentage)}
          >
            <Progress.Label c={textColor}>Unique</Progress.Label>
          </Progress.Section>
        </Tooltip>

        <Tooltip label={`${commonWords} common words`} position="bottom">
          <Progress.Section
            value={100 - uniqueWordPercentage}
            color={otherColor}
          >
            <Progress.Label c={textColor}>Common</Progress.Label>
          </Progress.Section>
        </Tooltip>
      </Progress.Root>
    </>
  );
};

export default StatProgress;
