"use client";
import {
  Heading,
  Box,
  Text,
  VStack,
  HStack,
  Link,
  Divider,
} from "@chakra-ui/react";

const blogPosts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    excerpt:
      "A deep dive into React Hooks and how they can simplify your code.",
    link: "/posts/react-hooks",
  },
  {
    id: 2,
    title: "Getting Started with Next.js",
    excerpt:
      "Learn the basics of Next.js and how to create your first application.",
    link: "/posts/nextjs-basics",
  },
  {
    id: 3,
    title: "Styling in Chakra UI",
    excerpt: "An introduction to styling your components using Chakra UI.",
    link: "/posts/chakra-ui-styling",
  },
];

export default function Home() {
  return (
    <Box p={4}>
      <Heading mb={6}>Blog Posts</Heading>
      <VStack spacing={8} align="stretch">
        {blogPosts.map((post) => (
          <Box key={post.id} p={5} shadow="md" borderWidth="1px">
            <HStack justify="space-between">
              <Heading fontSize="xl">
                <Link href={post.link}>{post.title}</Link>
              </Heading>
              <Text fontSize="sm" color="gray.500">
                {new Date().toLocaleDateString()}
              </Text>
            </HStack>
            <Text mt={4}>{post.excerpt}</Text>
            <Divider mt={4} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
