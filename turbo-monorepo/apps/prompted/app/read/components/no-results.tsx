"use client";
import { Box, Center, Title, Text, Button } from "@mantine/core";

interface NoResultsProps {
  resetFilterCallback: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({
  resetFilterCallback,
}) => {
  return (
    <Box
      p="sm"
      style={{
        flexGrow: 1,
        overflowY: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Center>
        <Title order={2}>No Results Found</Title>
      </Center>
      <Text mt="md">
        We couldn't find any results for your search. Please try a different
        query or check your spelling.
      </Text>
      <Button mt="lg" onClick={resetFilterCallback}>
        Clear Filters
      </Button>
    </Box>
  );
};
