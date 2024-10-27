"use client";

import React, { useState } from "react";
import { signup } from "../login/actions";
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

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!username || !email || !password) {
      setErrorString("Please fill out all fields.");
      return;
    }
    setLoading(true);
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    const result = await signup(formData);
    if (result === "REGISTERED") {
      setErrorString("This email is already registered. Please login.");
      setLoading(false);
      return;
    } else if (result === "SIGNUP_ERROR") {
      setErrorString("A signup error occurred. Please try again.");
      setLoading(false);
      return;
    }
  };

  const switchToLogin = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    router.replace("/login");
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
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
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
              <Text c="red" ta="center" size="sm" mt={5}>
                {errorString}
              </Text>
            )}
            <Button
              fullWidth
              size="md"
              onClick={handleSignup}
              loading={loading}
              loaderProps={{
                type: "dots",
              }}
            >
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
