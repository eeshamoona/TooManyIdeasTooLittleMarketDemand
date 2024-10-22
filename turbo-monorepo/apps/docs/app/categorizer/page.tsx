"use client";
import React, { useState } from "react";
import {
  Container,
  Text,
  Box,
  Badge,
  VStack,
  Heading,
  Spinner,
  Center,
  Button,
} from "@chakra-ui/react";
import { data } from "./data";

interface DataItem {
  title: string;
  description: string;
  items: string[];
}

const fetchCategorizedData = async (data: string[]): Promise<DataItem[]> => {
  console.log("Called fetchCategorizedData");
  try {
    const response = await fetch("/api/getCategories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
        length: 5,
      }),
    });
    const dataResponse = await response.json();
    let categorizedData = [];
    try {
      categorizedData = JSON.parse(dataResponse["categorizedData"]);
    } catch (error) {
      console.error("Error parsing AI Feedback JSON:", error);
    }
    return categorizedData;
  } catch (error) {
    console.error("Error fetching categorized data:", error);
    return [];
  }
};

const CategorizedDataPage: React.FC<{}> = () => {
  const [categorizedData, setCategorizedData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    const result = await fetchCategorizedData(data);
    setCategorizedData(result);
    setLoading(false);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Categorized Data
      </Heading>
      <Center mb={8}>
        <Button onClick={handleFetchData} colorScheme="blue">
          Fetch Categorized Data
        </Button>
      </Center>
      {loading ? (
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        categorizedData.map((item) => (
          <Box
            key={item.title}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            mb={4}
          >
            <VStack align="start">
              <Text fontSize="lg">{item.title}</Text>
              <Badge colorScheme="purple">{item.description}</Badge>
              <VStack align="start" mt={4}>
                {item.items.map((item) => (
                  <Text key={item}>{item}</Text>
                ))}
              </VStack>
            </VStack>
          </Box>
        ))
      )}
    </Container>
  );
};

export default CategorizedDataPage;
