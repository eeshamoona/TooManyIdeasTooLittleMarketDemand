"use client";
import {
  Card,
  Text,
  Badge,
  Group,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { PiExportLight } from "react-icons/pi";
import { IoCheckmark, IoTrash } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getEntry } from "../actions";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import { LuTimer, LuBaseline } from "react-icons/lu";
import { convertTimeToDescription } from "../../write/actions";
import { StatsProps } from "../[id]/components/stats-grid";
import { Character } from "../../write/components/tracked-textarea";

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
  deleteEntryCallback: (id: string) => void; // Assuming the callback takes an entry ID as a parameter
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

  // TODO: Export the rest of the stats for this entry as well
  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExported(true);

    getEntry(entry);

    setTimeout(() => {
      setExported(false);
    }, 3000);
  };

  const category = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === entry.category
  );
  const Icon = category?.icon;
  const color = `var(--mantine-color-${category?.color}-5)`;

  // Define the handleDelete function
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
              weekday: "short", // Add this line to include the day of the week
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

      {/* <Card.Section inheritPadding mt="sm">
        <StatProgress {...entry.metadata_stats} />
      </Card.Section> */}

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
