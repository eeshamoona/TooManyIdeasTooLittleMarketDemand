import React from "react";
import {
  Flex,
  Progress,
  Tooltip,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { getPercentageColor } from "../actions";

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

  return (
    <>
      <Flex mt="sm" gap={"sm"} align={"center"}>
        <Text size="sm" fw={"bold"}>
          Total Characters:
        </Text>
        <Text size="sm">{totalCharacters}</Text>
      </Flex>
      <Progress.Root size="lg">
        <Tooltip label={`${userCharacters} characters`} position="bottom">
          <Progress.Section
            value={userCharacters}
            bg={getPercentageColor(userPercentage, colorScheme)}
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
        <Text size="sm" fw={"bold"}>
          Total Words:
        </Text>
        <Text size="sm">{totalWords}</Text>
      </Flex>
      <Progress.Root size="lg">
        <Tooltip label={`${uniqueWordCount} unique words`} position="bottom">
          <Progress.Section
            value={uniqueWordPercentage}
            color={getPercentageColor(uniqueWordPercentage, colorScheme)}
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
