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
} from "@mantine/core";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);

  const handleLogin = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!email || !password) {
      return;
    }
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    const error = await login(formData);
    if (error) {
      setEmailError(true);
      setLoading(false);
      return;
    }
  };

  const switchToSignup = () => {
    //Clear all of the fields
    setEmail("");
    setPassword("");
    setEmailError(false);
    router.push("/signup");
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
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              size="md"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {emailError && (
              <Text c="red" ta="center" size="sm">
                Invalid email or password. Please try again.
              </Text>
            )}

            <Button
              fullWidth
              size="md"
              onClick={handleLogin}
              loading={loading}
              loaderProps={{
                type: "dots",
              }}
            >
              Login
            </Button>

            <Text c="dimmed" size="sm" ta="center" mt={5}>
              Do not have an account yet?{" "}
              <Anchor size="sm" component="button" onClick={switchToSignup}>
                Create account
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
