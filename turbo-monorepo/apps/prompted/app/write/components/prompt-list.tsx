import { useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  TextInput,
  rem,
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const filteredData = data.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );

  const rows = filteredData.map((row: Prompt) => {
    const Icon = NEW_PROMPT_CATEGORIES.find(
      (cat) => cat.title === row.category,
    )?.icon;

    return (
      <Table.Tr key={row.text}>
        <Table.Td
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
          }}
        >
          {Icon && <Icon style={{ marginRight: "8px" }} />}
          {row.category}
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
      <TextInput
        placeholder="Search for any prompt"
        mb="md"
        leftSection={<FaSearch style={{ width: rem(16), height: rem(16) }} />}
        value={search}
        onChange={handleSearchChange}
      />

      <ScrollArea
        h={400}
        offsetScrollbars
        scrollbarSize={8}
        scrollHideDelay={0}
      >
        <Table
          horizontalSpacing="xl"
          verticalSpacing="md"
          stickyHeader
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Th>Category</Th>
              <Th>Prompt</Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={Object.keys(data[0]).length}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}
