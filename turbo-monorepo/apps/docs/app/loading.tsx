"use client";
import { Box, Heading, Flex, Spinner } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg="gray.50"
      p={4}
    >
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Loading
        </Heading>
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Box>
    </Flex>
  );
};

export default Loading;
