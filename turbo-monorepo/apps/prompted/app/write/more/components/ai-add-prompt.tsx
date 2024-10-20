"use client";
import { useEffect, useState } from "react";
import {
  Select,
  Group,
  Paper,
  Button,
  SelectProps,
  Text,
  Center,
  ActionIcon,
  Stack,
  LoadingOverlay,
  Loader,
  useMantineColorScheme,
} from "@mantine/core";
import { NEW_PROMPT_CATEGORIES } from "../../interface";
import { FaCheck, FaPaperPlane } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { TbRefresh } from "react-icons/tb";
import { Prompt } from "../../components/display";

interface AiAddPromptFormProps {
  // eslint-disable-next-line no-unused-vars
  onCategorySelected: (category: string) => void;
  prompts: Prompt[];
}

export const AiAddPromptForm: React.FC<AiAddPromptFormProps> = ({
  onCategorySelected,
  prompts,
}) => {
  const [promptSuggestionIndex, setPromptSuggestionIndex] = useState<
    number | null
  >(null);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addedIndex, setAddedIndex] = useState<number | null>(null);
  const [saveLoading, { open: openSave, close: closeSave }] = useDisclosure();
  const { colorScheme } = useMantineColorScheme();
  const [promptsLoading, { open: openPrompts, close: closePrompts }] =
    useDisclosure();

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    openSave();

    if (addedIndex != null && addedIndex === promptSuggestionIndex) {
      setSuccess("Prompt already added");
      setError("");
      closeSave();
      return;
    }

    const promptText = promptSuggestions[promptSuggestionIndex] ?? "";
    if (!promptText || !category) {
      setError("Please fill in all fields");
      return;
    }

    const res = await fetch("/api/addPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: promptText, category }),
    });

    if (res.ok) {
      setAddedIndex(promptSuggestionIndex);
      setSuccess("Prompt added successfully");
      setError("");
    } else {
      setError("Failed to add prompt");
      setSuccess("");
    }
    closeSave();
  }

  const numberOfPrompts = 5;
  // Function to get category, get 10 new prompts, and call api to get 10 new prompts
  const getPromptSuggestions = async (category: string) => {
    openPrompts();
    const filteredPrompts = prompts.filter(
      (prompt) => prompt.category === category,
    );
    console.log("Filtered Prompts:", filteredPrompts);

    const randomPrompts = filteredPrompts
      .sort(() => 0.5 - Math.random())
      .slice(0, numberOfPrompts)
      .map((prompt) => prompt.text);
    console.log("Random Prompts:", randomPrompts);

    const categoryDescription = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === category,
    )?.description;
    console.log("Category Description:", categoryDescription);
    try {
      const res = await fetch("/api/getPromptSuggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          description: categoryDescription,
          prompts: randomPrompts,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const prompts = JSON.parse(data.aiSuggestionsArray).prompts;
        if (
          Array.isArray(prompts) &&
          prompts.every((item) => typeof item === "string")
        ) {
          console.log("Prompts are a valid array of strings:", prompts);
          setPromptSuggestionIndex(0);
          setPromptSuggestions(prompts);
        } else {
          console.error("Invalid data format: Expected an array of strings");
        }
      } else {
        console.error("Failed to fetch prompts");
      }
    } catch (error) {
      console.error(error);
    }
    closePrompts();
  };

  const handleCategoryChange = (value: string) => {
    if (value) {
      setAddedIndex(null);
      getPromptSuggestions(value);
    } else {
      setPromptSuggestions([]);
      console.log(
        "Category value is null or empty, skipping getPromptSuggestions",
      );
    }

    setCategory(value);
    onCategorySelected(value);
  };

  // Function to go through the 10 prompts one at a time
  // When the last prompt is reached, call the api to get 10 new prompts
  const handleNextPrompt = () => {
    if (promptSuggestions.length === 0) {
      setError("No prompt suggestions available");
      console.error("No prompt suggestions available");
      return;
    }

    setAddedIndex(null);
    if (promptSuggestionIndex != null) {
      if (promptSuggestionIndex < promptSuggestions.length - 1) {
        setPromptSuggestionIndex(promptSuggestionIndex + 1);
      } else {
        // Call API to get new prompts
        getPromptSuggestions(category);
      }
    } else {
      setError("No index found");
    }
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const category = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === option.value,
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
            fontWeight: "600", // Semi-bold for better readability
            fontSize: "14px", // Slightly larger for better legibility
          }}
        >
          {option.value}
        </Text>
        <Text
          c="dimmed"
          style={{
            fontSize: "12px", // Keep the label smaller for a subtle look
          }}
        >
          {option["description"]}
        </Text>
        {checked && (
          <FaCheck
            style={{
              marginLeft: "auto", // Push the check icon to the right
              color: "#1976d2", // Give it a pleasant, accent color
            }}
          />
        )}
      </Group>
    );
  };

  return (
    <Paper
      radius="sm"
      p="md"
      my="md"
      bg={
        colorScheme === "dark"
          ? "var(--mantine-color-dark-5)"
          : "var(--mantine-color-gray-0)"
      }
    >
      <Stack flex={1}>
        <Select
          label="Category"
          placeholder="Select a category"
          data={NEW_PROMPT_CATEGORIES.map((category) => ({
            value: category.title,
            label: category.title,
            description: category.description,
            icon: category.icon,
          }))}
          value={category}
          onChange={handleCategoryChange}
          required
          renderOption={renderSelectOption}
          flex={4}
          disabled={promptsLoading}
        />
        <Group mt={"sm"} flex={1} align="center">
          {promptsLoading ? (
            <Loader color="pink" type="dots" />
          ) : (
            <>
              <LoadingOverlay visible={promptsLoading} />

              <Text
                style={{
                  flex: "1",
                  fontSize: "14px",
                }}
              >
                {promptSuggestions[promptSuggestionIndex ?? 0] ||
                  "No prompts available"}
              </Text>
              <ActionIcon
                variant={
                  promptSuggestionIndex === promptSuggestions.length - 1
                    ? "filled"
                    : "subtle"
                }
                color={
                  promptSuggestionIndex === promptSuggestions.length - 1
                    ? "pink"
                    : ""
                }
                onClick={handleNextPrompt}
              >
                <TbRefresh />
              </ActionIcon>
              <Button
                onClick={handleSubmit}
                style={{
                  alignSelf: "end",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                px={"sm"}
                variant="light"
                color="blue"
                loading={saveLoading}
                leftSection={<FaPaperPlane />}
              >
                Add Prompt
              </Button>
            </>
          )}
        </Group>
      </Stack>
      {error && (
        <Text
          c="red"
          size="sm"
          style={{
            textAlign: "center",
            marginTop: "0.5rem",
          }}
        >
          {error}
        </Text>
      )}
      {success && (
        <Text
          c="green"
          size="sm"
          style={{
            textAlign: "center",
            marginTop: "0.5rem",
          }}
        >
          {success}
        </Text>
      )}
    </Paper>
  );
};
