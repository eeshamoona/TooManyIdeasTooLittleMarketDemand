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
import { IoCheckmark } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getEntry } from "../actions";
import StatProgress from "./bar-chart";
import { NEW_PROMPT_CATEGORIES } from "../../write/interface";
import { LuTimer } from "react-icons/lu";
import { convertTimeToDescription } from "../../write/actions";

export function SubmissionCard({ submission }) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [exported, setExported] = useState(false);

  const handleCardClick = () => {
    router.push(`/read/${submission.id}`);
  };

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExported(true);

    getEntry(submission);

    setTimeout(() => {
      setExported(false);
    }, 3000);
  };

  const category = NEW_PROMPT_CATEGORIES.find(
    (cat) => cat.title === submission.category,
  );
  const Icon = category?.icon;
  const color = `var(--mantine-color-${category?.color}-5)`;

  return (
    <Card
      withBorder
      radius="md"
      shadow="sm"
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
        transition: "box-shadow 150ms ease, transform 100ms ease",
        boxShadow: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.md;
        e.currentTarget.style.transform = "scale(1.01)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "scale(1)";
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
            {submission.category}
          </Badge>
        )}
        <Group>
          <Text size="sm" c="dimmed">
            {new Date(submission.created_at).toLocaleDateString("en-US", {
              weekday: "long", // Add this line to include the day of the week
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
          </Text>
        </Group>
      </Group>

      <Text fz="lg" fw={500} mt="md">
        {submission.prompt}
      </Text>
      <Text
        fz="sm"
        c="dimmed"
        mt={5}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {submission.text}
      </Text>

      <Card.Section inheritPadding mt="sm">
        <StatProgress {...submission.metadata_stats} />
      </Card.Section>
      <Card.Section inheritPadding pb="md">
        <Group justify="space-between" mt="md">
          <Group justify="center" gap={"xs"}>
            <LuTimer />
            <Text fz="xs" c="dimmed">
              {convertTimeToDescription(submission.metadata_stats.elapsedTime)}
            </Text>
          </Group>
          <ActionIcon
            onClick={handleExport}
            variant="default"
            size="lg"
            radius="md"
          >
            {exported ? <IoCheckmark color="green" /> : <PiExportLight />}
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
}
