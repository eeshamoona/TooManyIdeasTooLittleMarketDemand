"use client";

import React, { useState } from "react";
import { login } from "./actions";
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Container,
  Stack,
  Text,
  Anchor,
  Group,
} from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorString, setErrorString] = useState<string | null>(null);

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setErrorString(null);
    if (!email || !password) {
      setErrorString("Please fill out all fields.");
      return;
    }
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    const error = await login(formData);
    if (error) {
      switch (error) {
        case "INCORRECT_PASSWORD":
          setErrorString("Incorrect password. Please try again.");
          break;
        case "EMAIL_NOT_REGISTERED":
          setErrorString("This email is not registered. Please sign up.");
          break;
        default:
          setErrorString("An unknown error occurred. Please try again.");
      }
      setLoading(false);
      return;
    }
  };

  const switchToSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    router.replace("/signup");
  };

  return (
    <Container size="xs" style={{ display: "flex", alignItems: "center" }}>
      <Paper radius="md" p="xl" w="100%" withBorder>
        <Title order={2} ta="center" mt="md" mb={50}>
          Hey There! Creativity awaits...
        </Title>

        <form>
          <Stack>
            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              size="md"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {errorString !== null && (
              <Text c="red" ta="center" size="sm">
                {errorString}
              </Text>
            )}

            <Group justify="space-between">
              <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{" "}
                <Anchor size="sm" component="button" onClick={switchToSignup}>
                  Create account
                </Anchor>
              </Text>
              <Button
                size="md"
                onClick={handleLogin}
                loading={loading}
                loaderProps={{
                  type: "dots",
                }}
              >
                Login
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
