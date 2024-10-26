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
  indices: string[];
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

  // determine if the categorizedData has every single index in the data array and no duplicates
  // log whether the categorizedData has every single index and if not log the missing indices
  const categorizedIndices = new Set(
    categorizedData.reduce((acc, item) => acc.concat(item.indices), []),
  );

  const dataIndices = data.map((_, index) => index); // Map data array to its indices
  const missingIndices = dataIndices.filter(
    (index) => !categorizedIndices.has(index),
  );

  console.log(
    `Categorized data has all indices: ${missingIndices.length === 0 ? "Yes" : "No"}`,
  );
  if (missingIndices.length > 0) {
    console.log("Missing indices:", missingIndices.toString());
  }

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
                {item.indices.map((item) => (
                  <Text key={item}>{data[item]}</Text>
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
