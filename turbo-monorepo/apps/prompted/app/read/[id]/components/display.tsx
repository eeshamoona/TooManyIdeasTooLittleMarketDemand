"use client";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Paper,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { FaLightbulb, FaRegLightbulb } from "react-icons/fa";
import { Character } from "../../../write/components/tracked-textarea";
import { useRouter } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";

interface DisplayTextProps {
  data: {
    metadata_stats: any;
    text: string;
    character_data: Character[];
    prompt: string;
  };
}

export default function DisplayText({ data }: DisplayTextProps) {
  const [showAIParts, setShowAIParts] = useState(true);
  const router = useRouter();

  const handleToggleStats = () => {
    setShowAIParts((prev) => !prev);
  };

  return (
    <Container h="100%">
      <Box
        my={"md"}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          variant="outline"
          leftSection={<LuLayoutDashboard />}
          onClick={() => router.push("/read")}
        >
          View All
        </Button>
        <ActionIcon
          onClick={handleToggleStats}
          color={!showAIParts ? "yellow" : "gray"}
          variant="light"
        >
          {showAIParts ? <FaLightbulb /> : <FaRegLightbulb />}
        </ActionIcon>
      </Box>
      <Title order={2}>{data.prompt}</Title>
      <Box style={{ flex: 1, overflow: "auto", maxHeight: "100%" }}>
        <Paper
          my="md"
          style={{ height: "100%", overflowY: "auto", padding: "16px" }}
        >
          {showAIParts ? (
            <div>{data.text}</div>
          ) : (
            data.character_data.map((char: Character, index: number) => (
              <span
                key={index}
                style={{
                  backgroundColor:
                    char.type === "AI" ? "yellow" : "transparent",
                }}
              >
                {char.value}
              </span>
            ))
          )}
        </Paper>
      </Box>
    </Container>
  );
}
