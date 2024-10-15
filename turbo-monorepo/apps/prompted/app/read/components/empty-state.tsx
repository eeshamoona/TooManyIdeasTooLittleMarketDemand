"use client";
import {
  Box,
  SimpleGrid,
  Skeleton,
  Center,
  Title,
  Button,
} from "@mantine/core";
import { useRouter } from "next/navigation";

export const EmptyState = () => {
  const router = useRouter();

  return (
    <Box
      p="sm"
      style={{
        flexGrow: 1,
        overflowY: "auto",
        position: "relative",
      }}
    >
      <SimpleGrid cols={2} spacing="sm" verticalSpacing="sm">
        {/* Display skeletons to simulate empty cards */}
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} height={150} radius="md" />
        ))}
      </SimpleGrid>

      <Center
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            borderRadius: "10px",
            gap: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Title order={4}>Write your first entry!</Title>
          <Button size="md" onClick={() => router.push("/write")}>
            Start Writing
          </Button>
        </div>
      </Center>
    </Box>
  );
};
