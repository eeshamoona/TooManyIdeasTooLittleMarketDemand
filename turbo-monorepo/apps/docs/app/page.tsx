"use client";
import {
  Heading,
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Link,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaPenFancy, FaUsers, FaStar } from "react-icons/fa";

export default function Home() {
  return (
    <Box p={4}>
      {/* Hero Section */}
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h1" size="2xl" mb={4}>
          Welcome to Creative Prompt Writer
        </Heading>
        <Text fontSize="lg" mb={6}>
          Unleash your creativity with our AI-powered prompt writing tool.
        </Text>
        <Button colorScheme="teal" size="lg">
          Get Started
        </Button>
      </Box>

      <Divider my={10} />

      {/* Features Section */}
      <Box py={10} px={6}>
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          Features
        </Heading>
        <VStack spacing={8} align="stretch">
          <HStack spacing={4}>
            <Icon as={FaPenFancy} w={8} h={8} color="teal.500" />
            <Text fontSize="lg">
              Generate creative prompts to spark your imagination and use AI to
              help you get through writer's block as you write!
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Icon as={FaUsers} w={8} h={8} color="teal.500" />
            <Text fontSize="lg">
              Submit your responses and get badges for completing challenges.
            </Text>
          </HStack>
          <HStack spacing={4}>
            <Icon as={FaStar} w={8} h={8} color="teal.500" />
            <Text fontSize="lg">
              Save your favorite prompts and revisit them anytime.
            </Text>
          </HStack>
        </VStack>
      </Box>

      <Divider my={10} />

      <Divider my={10} />

      {/* Footer Section */}
      <Box py={10} px={6} textAlign="center">
        <Text fontSize="sm" color="gray.500" mb={4}>
          &copy; {new Date().getFullYear()} Creative Prompt Writer. All rights
          reserved.
        </Text>
        <HStack spacing={4} justify="center">
          <Link href="#" color="teal.500">
            Facebook
          </Link>
          <Link href="#" color="teal.500">
            Twitter
          </Link>
          <Link href="#" color="teal.500">
            Instagram
          </Link>
          <Link href="#" color="teal.500">
            Contact Us
          </Link>
        </HStack>
      </Box>
    </Box>
  );
}
