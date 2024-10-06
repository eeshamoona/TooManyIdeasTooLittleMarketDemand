// app/signin/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
// import { signin } from "@/actions/auth/actions";

import {
  FormLabel,
  Input,
  Button,
  Divider,
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";

export default async function SignInPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }

  return (
    <Box
      as="main"
      className="flex min-h-screen flex-col items-center justify-center"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <VStack spacing={2} align="center">
            <Heading as="h1" size="xl" fontWeight="bold">
              Welcome
            </Heading>
            <Text color="gray.500">
              Enter your email below to login to your account
            </Text>
          </VStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} as="form">
            <VStack spacing={2} align="stretch">
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </VStack>
            <VStack spacing={2} align="stretch">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" name="password" required type="password" />
            </VStack>
            <Button width="full" colorScheme="teal">
              Sign in
            </Button>
          </VStack>
          <Divider my={6} />
          <Button width="full" variant="outline" colorScheme="teal">
            Sign in with Google
          </Button>
        </CardBody>
        <CardFooter>
          <Text fontSize="sm">
            Don't have an account?{" "}
            <Link href="/signup">
              <Text as="span" textDecoration="underline">
                Sign up here
              </Text>
            </Link>
          </Text>
        </CardFooter>
      </Card>
    </Box>
  );
}
