"use client";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoCheckmark, IoTrash } from "react-icons/io5";
import { LuBaseline, LuTimer } from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { convertTimeToDescription } from "../../write/actions";
import { Character } from "../../write/components/tracked-textarea";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import { StatsProps } from "../[id]/components/stats-grid";
import { getEntry } from "../actions";

interface EntryCardProps {
  entry: {
    id: any;
    metadata_stats: StatsProps;
    text: string;
    character_data: Character[];
    word_freq: { [key: string]: number };
    prompt: string;
    category: string;
    created_at: string;
    ai_feedback: any;
  };
  staticMode: boolean;
  editMode: boolean;
  // eslint-disable-next-line no-unused-vars
  deleteEntryCallback: (id: string) => void;
}

export function EntryCard({
  entry,
  editMode,
  staticMode,
  deleteEntryCallback,
}: EntryCardProps) {
  if (!entry) return null;

  const router = useRouter();
  const theme = useMantineTheme();
  const [exported, setExported] = useState(false);

  const handleCardClick = () => {
    router.push(`/read/${entry.id}`);
  };
  
  const handleExport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Export initiated for entry:", entry.id);
    setExported(true);

    const entryContent = await getEntry(entry);
    console.log("Entry fetched:", entryContent);

    // Create a Blob from the entry content
    const blob = new Blob([entryContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `entry_${entry.id}.txt`; // Set the filename
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up

    setTimeout(() => {
      console.log("Export completed for entry:", entry.id);
      setExported(false);
      URL.revokeObjectURL(url); // Release the object URL
    }, 3000);
  };

  const category = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === entry.category
  );
  const Icon = category?.icon;
  const color = `var(--mantine-color-${category?.color}-5)`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEntryCallback(entry.id);
  };

  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      onClick={!staticMode ? handleCardClick : undefined}
      style={{
        cursor: !staticMode ? "pointer" : "default",
        transition: !staticMode
          ? "box-shadow 150ms ease, transform 100ms ease"
          : undefined,
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        if (!staticMode) {
          e.currentTarget.style.boxShadow = theme.shadows.md;
          e.currentTarget.style.transform = "scale(1.01)";
        }
      }}
      onMouseLeave={(e) => {
        if (!staticMode) {
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      <Group justify="space-between">
        {Icon && (
          <Badge
            size="md"
            radius="sm"
            variant="light"
            color={color}
            leftSection={<Icon />}
          >
            {entry.category}
          </Badge>
        )}
        <Group>
          <Text size="sm" c="dimmed">
            {new Date(entry.created_at).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </Text>
        </Group>
      </Group>

      <Text fz="lg" fw={500} mt="md">
        {entry.prompt}
      </Text>
      <Text
        fz="sm"
        c="dimmed"
        mt={5}
        flex={1}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {entry.text}
      </Text>

      <Card.Section inheritPadding pb="sm">
        <Group justify="apart" mt="md">
          <Group gap="xs">
            <LuTimer />
            <Text size="xs" color="dimmed">
              {convertTimeToDescription(entry.metadata_stats.elapsedTime)}
            </Text>
          </Group>
          <Group gap="xs">
            <LuBaseline />
            <Text size="xs" c="dimmed">
              {entry.metadata_stats.totalWords} words
            </Text>
          </Group>
          <Group gap="xs" flex={1} justify="end">
            {editMode ? (
              <ActionIcon
                onClick={handleDelete}
                variant="outline"
                size="lg"
                radius="md"
                color="red"
              >
                <IoTrash />
              </ActionIcon>
            ) : (
              <ActionIcon
                onClick={handleExport}
                variant="default"
                size="lg"
                radius="md"
                color="blue"
              >
                {exported ? <IoCheckmark color="green" /> : <PiExportLight />}
              </ActionIcon>
            )}
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
