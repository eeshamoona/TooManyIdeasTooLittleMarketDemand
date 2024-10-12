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
    <Container>
      <Button
        variant="outline"
        leftSection={<LuLayoutDashboard />}
        onClick={() => router.push("/read")}
      >
        View All
      </Button>
      <Box my={"md"} style={{ display: "flex", justifyContent: "end" }}>
        <ActionIcon
          onClick={handleToggleStats}
          color={!showAIParts ? "yellow" : "gray"}
          variant="light"
        >
          {showAIParts ? <FaLightbulb /> : <FaRegLightbulb />}
        </ActionIcon>
      </Box>
      <Title order={2}>{data.prompt}</Title>
      {showAIParts ? (
        <Paper my={"md"}>
          <div>{data.text}</div>
        </Paper>
      ) : (
        <Paper my={"md"}>
          {data.character_data.map((char: Character, index: number) => (
            <span
              key={index}
              style={{
                backgroundColor: char.type === "AI" ? "yellow" : "transparent",
              }}
            >
              {char.value}
            </span>
          ))}
        </Paper>
      )}
    </Container>
  );
}
