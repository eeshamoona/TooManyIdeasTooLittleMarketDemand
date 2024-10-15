import React, { useState } from "react";
import {
  Box,
  TextInput,
  Select,
  MultiSelect,
  Button,
  useMantineColorScheme,
} from "@mantine/core";
import { TiPencil } from "react-icons/ti";
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  hasEntries: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  hasEntries,
}: SearchHeaderProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const { colorScheme } = useMantineColorScheme();

  const headingColor =
    colorScheme === "dark"
      ? "var(--mantine-color-dark-5)"
      : "var(--mantine-color-gray-0)";

  const handleSearch = () => {
    // Implement search logic here
    console.log("Search Query:", searchQuery);
    console.log("Category:", category);
    console.log("Tags:", tags);
  };

  return (
    <Box
      p={"sm"}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: headingColor,
        borderRadius: 5,
        display: "flex",
        gap: "1rem",
      }}
    >
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        style={{ flex: 1 }}
        disabled={!hasEntries}
      />
      <Select
        placeholder="Select category"
        value={category}
        onChange={setCategory}
        data={[
          { value: "category1", label: "Category 1" },
          { value: "category2", label: "Category 2" },
          { value: "category3", label: "Category 3" },
        ]}
        disabled={!hasEntries}
      />
      <MultiSelect
        placeholder="Select tags"
        value={tags}
        onChange={setTags}
        data={[
          { value: "tag1", label: "Tag 1" },
          { value: "tag2", label: "Tag 2" },
          { value: "tag3", label: "Tag 3" },
        ]}
        disabled={!hasEntries}
      />
      <Button onClick={handleSearch} disabled={!hasEntries}>
        Search
      </Button>
      <Button
        variant="subtle"
        leftSection={<TiPencil />}
        onClick={() => router.push("/write")}
      >
        Write!
      </Button>
    </Box>
  );
};

export default SearchHeader;
