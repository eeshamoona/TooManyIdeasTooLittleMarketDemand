"use client";

import React from "react";
import { signup } from "../login/actions";
import {
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Container,
  Stack,
  Text,
  Anchor,
} from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    await signup(formData);
  };

  const switchToLogin = () => {
    router.push("/login");
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
              label="Username"
              placeholder="mostCreativeWriterEver"
              size="md"
              id="username"
              name="username"
              required
            />
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
            <Button fullWidth size="md" onClick={handleSignup}>
              Sign up
            </Button>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
              Already have an account?{" "}
              <Anchor size="sm" component="button" onClick={switchToLogin}>
                Login
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
