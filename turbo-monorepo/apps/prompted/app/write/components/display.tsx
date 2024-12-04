"use client";
import {
  ActionIcon,
  Box,
  Center,
  Group,
  SelectProps,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { TbWriting } from "react-icons/tb";
import { profileQuizQuestions } from "../../profile-quiz/constants";
import { NEW_PROMPT_CATEGORIES } from "../interface";
import { PromptList } from "./prompt-list";
import TrackedTextarea from "./tracked-textarea";

export interface Prompt {
  text: string;
  category: string;
}

export interface Profile {
  targetWordCount?: number;
  feedbackPersona?: string;
  motivatingFeedback?: string;
}

export interface DisplayProps {
  prompts: Prompt[];
  profile: Profile | null;
}

export default function Display({ prompts, profile }: DisplayProps) {
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);
  const [randomPrompt, setRandomPrompt] = useState<Prompt | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleFilterChange = (value: string) => {
    const filtered = prompts.filter((prompt) => prompt.category === value);
    if (!value) {
      setFilteredPrompts(prompts);
    } else {
      setFilteredPrompts(filtered);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (!randomPrompt || !randomPrompt.category) {
      setSelectedCategory(value);
      handleFilterChange(value);
    }
  };

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * filteredPrompts.length);
    const randomPrompt = filteredPrompts[randomIndex];
    setSelectedCategory(randomPrompt.category);
    setRandomPrompt(randomPrompt);
  };

  const handleSelectSinglePrompt = (prompt: Prompt) => {
    setSelectedCategory(prompt.category);
    setRandomPrompt(prompt);
  };

  const clearRandomPrompt = () => {
    setFilteredPrompts(prompts);
    setSelectedCategory(null);
    setRandomPrompt(null);
  };

  const fullCategoryElement = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === selectedCategory
  );

  const leftSectionIcon = () => {
    const Icon = fullCategoryElement?.icon;
    const color = fullCategoryElement?.color
      ? `var(--mantine-color-${fullCategoryElement?.color}-5)`
      : "var(--mantine-color-dimmed)";

    return (
      <ActionIcon variant="transparent" color={color} size="lg">
        {Icon ? <Icon /> : <TbWriting />}
      </ActionIcon>
    );
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const category = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === option.value
    );
    const Icon = category?.icon;
    const color = category?.color;
    return (
      <Group
        flex="1"
        align="center"
        style={{
          padding: "0px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        gap="sm"
      >
        {Icon && (
          <Center>
            <ActionIcon variant="light" color={color} size="lg">
              <Icon />
            </ActionIcon>
          </Center>
        )}
        <Text
          style={{
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {option.value}
        </Text>
        <Text
          c="dimmed"
          style={{
            fontSize: "12px",
          }}
        >
          {option["description"]}
        </Text>
        {checked && (
          <FaCheck
            style={{
              marginLeft: "auto",
              color: "#1976d2",
            }}
          />
        )}
      </Group>
    );
  };

  const getProfileDescription = (questionKey: string, value: string) => {
    const question = profileQuizQuestions.find(
      (q) => q.question === questionKey
    );
    const option = question?.options.find((opt) => opt.value === value);
    return option ? `${option.label} - ${option.description}` : value;
  };

  const enrichedProfile =
    profile && Object.keys(profile).length > 0
      ? {
          targetWordCount: profile.targetWordCount,
          feedbackPersona: getProfileDescription(
            "feedbackPersona",
            profile.feedbackPersona
          ),
          motivatingFeedback: getProfileDescription(
            "motivatingFeedback",
            profile.motivatingFeedback
          ),
        }
      : null;

  return (
    <Box style={{ display: "flex", flexDirection: "column", height: "85vh" }}>
      <Group mt="xl" style={{ justifyContent: "flex-start" }} gap="0"></Group>

      <Stack style={{ flex: 1, width: "100%" }}>
        {randomPrompt ? (
          <TrackedTextarea
            promptText={randomPrompt?.text}
            categoryText={randomPrompt?.category}
            targetWordCount={enrichedProfile?.targetWordCount}
            profile={enrichedProfile}
            onResetPrompt={clearRandomPrompt}
            Icon={fullCategoryElement?.icon}
            color={fullCategoryElement?.color}
          />
        ) : (
          <>
            <PromptList
              data={filteredPrompts}
              onSelectPrompt={handleSelectSinglePrompt}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              leftSectionIcon={leftSectionIcon}
              handleFilterChange={handleFilterChange}
              handleRandomPrompt={handleRandomPrompt}
              randomPrompt={randomPrompt}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
