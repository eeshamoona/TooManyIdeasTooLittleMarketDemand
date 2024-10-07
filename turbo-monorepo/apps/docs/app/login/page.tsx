"use client";

import { login, signup } from "./actions";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Box
      w="100vw"
      h="100vh"
      bg="gray.100"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        w={{ base: "90%", md: "400px" }}
      >
        <Heading mb={6} textAlign="center">
          Welcome Back
        </Heading>
        <form>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </FormControl>
            <Button
              type="submit"
              formAction={login}
              colorScheme="teal"
              w="100%"
            >
              Log in
            </Button>
            <Button
              type="submit"
              formAction={signup}
              variant="outline"
              colorScheme="teal"
              w="100%"
            >
              Sign up
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
