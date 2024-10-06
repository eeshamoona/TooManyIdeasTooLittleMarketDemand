"use client";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();

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
          404
        </Heading>
        <Text fontSize="xl" mb={4}>
          Oops! The page you're looking for doesn't exist.
        </Text>
        <Button colorScheme="teal" onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </Box>
    </Flex>
  );
};

export default Custom404;
