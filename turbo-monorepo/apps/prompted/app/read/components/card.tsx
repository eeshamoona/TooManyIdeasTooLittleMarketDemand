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
        <Badge variant="light" color="blue" size="sm" radius="sm">
          {submission.category}
        </Badge>
        <Text fz="xs" c="dimmed">
          Completed in {submission.metadata_stats.elapsedTime}
        </Text>
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
        <Group justify="end" mt="md">
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
