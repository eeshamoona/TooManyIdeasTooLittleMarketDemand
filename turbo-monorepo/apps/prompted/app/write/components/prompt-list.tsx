import { useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  TextInput,
  rem,
  Badge,
  Switch,
  Space,
} from "@mantine/core";
import { FaSearch } from "react-icons/fa";
import { Prompt } from "./display";
import { NEW_PROMPT_CATEGORIES } from "../interface";

interface PromptListProps {
  data: Prompt[];
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

export function PromptList({ data }: PromptListProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPrompts(event.currentTarget.checked);
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
      </Table.Tr>
    );
  });

  return (
    <div>
      <Group mb="md" w="100%">
        {showPrompts ? (
          <TextInput
            flex={1}
            w={"100%"}
            placeholder="Search for any prompt"
            leftSection={
              <FaSearch style={{ width: rem(16), height: rem(16) }} />
            }
            value={search}
            onChange={handleSearchChange}
          />
        ) : (
          <Space h={rem(36)} flex={1} />
        )}
        <Switch
          label="Show Prompts"
          checked={showPrompts}
          onChange={handleToggleChange}
        />
      </Group>

      {showPrompts && (
        <ScrollArea
          h={"55vh"}
          offsetScrollbars
          scrollbarSize={8}
          scrollHideDelay={0}
        >
          <Table
            horizontalSpacing="sm" // Reduced horizontal spacing
            verticalSpacing="sm" // Reduced vertical spacing
            stickyHeader
            highlightOnHover
          >
            <Table.Thead>
              <Table.Tr>
                <Th>#</Th>
                <Th>Category</Th>
                <Th>Prompt</Th>
              </Table.Tr>
            </Table.Thead>
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
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
