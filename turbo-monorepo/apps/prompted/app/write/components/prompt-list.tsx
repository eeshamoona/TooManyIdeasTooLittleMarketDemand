import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  ScrollArea,
  Select,
  SelectProps,
  Switch,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaCheck, FaRandom, FaSearch } from "react-icons/fa";
import { IoShuffleOutline } from "react-icons/io5";
import { RiArrowRightCircleLine } from "react-icons/ri";

import { NEW_PROMPT_CATEGORIES } from "../interface";
import { Prompt } from "./display";

interface PromptListProps {
  data: Prompt[];
  // eslint-disable-next-line no-unused-vars
  onSelectPrompt?: (prompt: Prompt) => void;
  handleFilterChange: (value: string) => void;
  leftSectionIcon: () => JSX.Element;
  selectedCategory: string | null;
  handleCategoryChange: (value: string) => void;
  handleRandomPrompt: () => void;
  randomPrompt: Prompt | null;
}

function Th({ children }) {
  return (
    <Table.Th>
      <UnstyledButton>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export function PromptList({
  data,
  onSelectPrompt,
  handleFilterChange,
  leftSectionIcon,
  selectedCategory,
  handleCategoryChange,
  handleRandomPrompt,
  randomPrompt,
}: PromptListProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowPrompts(true);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPrompts(event.currentTarget.checked);
  };

  const fullSelectedCategory = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === selectedCategory
  );

  const randomIcon = () => {
    if (fullSelectedCategory === undefined) return <IoShuffleOutline />;
    const Icon = fullSelectedCategory?.icon;

    return Icon ? <Icon /> : <IoShuffleOutline />;
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

  const renderIcon = (categoryName: string | null) => {
    if (!categoryName) return <FaRandom />;
    const category = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === categoryName
    );
    return category?.icon;
  };

  const filteredData = data.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filteredData.map((row: Prompt, index: number) => {
    const category = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === row.category
    );
    const Icon = category?.icon;
    const color = `var(--mantine-color-${category?.color}-5)`;

    const handleOnClick = () => {
      onSelectPrompt && onSelectPrompt(row);
    };

    return (
      <Table.Tr key={row.text}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
          }}
        >
          {Icon && (
            <Badge
              size="md"
              radius="md"
              variant="light"
              color={color}
              leftSection={<Icon />}
            >
              {row.category}
            </Badge>
          )}
        </Table.Td>
        <Table.Td
          style={{
            whiteSpace: "wrap",
          }}
        >
          {row.text}
        </Table.Td>
        {onSelectPrompt && (
          <Table.Td>
            <ActionIcon variant="subtle" size={"lg"} onClick={handleOnClick}>
              <RiArrowRightCircleLine size={20} />
            </ActionIcon>
          </Table.Td>
        )}
      </Table.Tr>
    );
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 8rem)",
      }}
    >
      <Group justify="space-between" mb="md">
        <TextInput
          flex={1}
          placeholder="Search for any prompt"
          leftSection={<FaSearch style={{ width: "1rem", height: "1rem" }} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Select
          flex={2}
          defaultValue={null}
          placeholder="Filter prompts by category"
          data={NEW_PROMPT_CATEGORIES.map((category) => ({
            value: category.title,
            label: category.title,
            description: category.description,
            icon: category.icon,
          }))}
          renderOption={renderSelectOption}
          size="sm"
          value={selectedCategory}
          onChange={handleCategoryChange}
          leftSection={leftSectionIcon()}
          clearable
        />
        <Button
          color={fullSelectedCategory?.color}
          onClick={handleRandomPrompt}
          variant="light"
          size="sm"
          leftSection={randomIcon()}
          aria-label={`Get Random ${fullSelectedCategory?.title} Prompt`}
        >
          Get Random Prompt
        </Button>
      </Group>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <ScrollArea
          h="100%"
          offsetScrollbars
          scrollbarSize={8}
          scrollHideDelay={0}
        >
          {mounted && (
            <Table
              horizontalSpacing="sm"
              verticalSpacing="sm"
              stickyHeader
              highlightOnHover={onSelectPrompt ? false : true}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th colSpan={onSelectPrompt ? 4 : 3} pl={0} pt={0}>
                    <Group justify="space-between">
                      <Group>
                        <Th>#</Th>
                        <Th>Category</Th>
                        <Th>Prompt</Th>
                        {onSelectPrompt && <Th>{undefined}</Th>}
                      </Group>
                      <Switch
                        checked={showPrompts}
                        onChange={handleToggleChange}
                        label="Show Prompts"
                        size="xs"
                        style={{
                          fontWeight: "normal",
                        }}
                      />
                    </Group>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              {showPrompts && (
                <Table.Tbody>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={Object.keys(data[0]).length + 1}>
                        <Text fw={500} ta="center">
                          Nothing found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              )}
            </Table>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
