"use client";
import { Box, Heading, VStack, HStack, Text, Divider } from "@chakra-ui/react";
import { Button as CustomButton } from "@repo/ui/button";

const sharedComponents = [
  {
    id: 1,
    name: "Button",
    description: "A customizable button component.",
    component: <CustomButton appName="MyApp">Click Me</CustomButton>,
  },
];

export default function ComponentsShowcase() {
  return (
    <Box p={4}>
      <Heading mb={6}>Shared Styled Components</Heading>
      <VStack spacing={8} align="stretch">
        {sharedComponents.map((comp) => (
          <Box key={comp.id} p={5} shadow="md" borderWidth="1px">
            <HStack justify="space-between">
              <Heading fontSize="xl">{comp.name}</Heading>
            </HStack>
            <Text mt={4}>{comp.description}</Text>
            <Box mt={4}>{comp.component}</Box>
            <Divider mt={4} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
