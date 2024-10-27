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
  const [registeredAlready, setRegisteredAlready] = useState(false);

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!username || !email || !password) {
      return;
    }
    setLoading(true);
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    const result = await signup(formData);
    if (result === "REGISTERED") {
      setRegisteredAlready(true);
      setLoading(false);
      return;
    }
  };

  const switchToLogin = () => {
    //Clear all of the fields
    setUsername("");
    setEmail("");
    setPassword("");
    setRegisteredAlready(false);

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
            {registeredAlready && (
              <Text c="red" ta="center" size="sm" mt={5}>
                This email is already registered. Please login.
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
