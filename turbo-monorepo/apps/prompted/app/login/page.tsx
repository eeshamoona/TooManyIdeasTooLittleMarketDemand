"use client";

import React from "react";
import { login, signup } from "./actions";
import {
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Container,
  Stack,
} from "@mantine/core";

export default function LoginPage() {
  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    await login(formData);
  };

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    await signup(formData);
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
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              size="md"
              id="password"
              name="password"
              required
            />
            <Checkbox label="Keep me logged in" size="md" />
            <Button fullWidth size="md" onClick={handleLogin}>
              Login
            </Button>
            <Button
              fullWidth
              size="md"
              variant="outline"
              onClick={handleSignup}
            >
              Sign up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
