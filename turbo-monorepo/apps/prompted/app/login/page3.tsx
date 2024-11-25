"use client";

import React, { useState } from "react";
import {
  Button,
  TextInput,
  PasswordInput,
  Container,
  Stack,
  Text,
  Group,
  Title,
  Anchor,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { login, magicLinkLogin } from "./actions"; // Import actions
import { LuSparkles } from "react-icons/lu";

export default function LoginPage() {
  const router = useRouter();
  const [isMagicLink, setIsMagicLink] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSet] = useState<boolean>(false);

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorString(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorString("Please enter your email.");
      return;
    } else if (!emailPattern.test(email)) {
      setErrorString("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await magicLinkLogin(formData);
    if (typeof result === "string") {
      if (result === "MAGIC_LINK_SENT") {
        setMagicLinkSet(true);
      } else if (result === "EMAIL_NOT_REGISTERED") {
        setErrorString("We don't recognize this email, please sign up.");
      } else if (result.startsWith("MAGIC_LINK_ERROR")) {
        const errorString = result.replace("MAGIC_LINK_ERROR", "").trim();
        setErrorString(errorString);
      } else {
        console.error("An unknown error occurred in handle Magic Link");
        setErrorString("An unexpected error occurred. Please try again later.");
      }
    }
    setLoading(false);
  };

  const handlePasswordLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorString(null);

    if (!email || !password) {
      setErrorString(null);
      return;
    }

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);
    console.log("Result", result);

    if (result === "INCORRECT_PASSWORD") {
      setErrorString("Incorrect password.");
    } else if (result === "EMAIL_PASSWORD_REQUIRED") {
      setErrorString("Email and password are required.");
    } else if (result === "EMAIL_NOT_REGISTERED") {
      setErrorString("Email not registered, please sign up");
    }
  };

  return (
    <Container size="sm">
      <Title ta="center" order={1} mt="xl">
        Log In
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Welcome back! Continue your creative journey.
      </Text>

      {isMagicLink ? (
        <form onSubmit={handleMagicLink}>
          <Stack>
            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              name="email"
              id="email"
            />
            {errorString && (
              <Text ta="center" size="sm" c="red">
                {errorString}
              </Text>
            )}
            {magicLinkSent && (
              <Text ta="center" size="sm" c="green">
                Magic Link Successfully Sent! Please check your email.
              </Text>
            )}
            <Button
              type="submit"
              size="md"
              fullWidth
              loading={loading}
              leftSection={<LuSparkles />}
            >
              Get Magic Link
            </Button>
            <Text ta="center" c="dimmed" size="sm">
              Prefer using a password?{" "}
              <Anchor onClick={() => setIsMagicLink(false)} component="button">
                Login with Password
              </Anchor>
            </Text>
          </Stack>
        </form>
      ) : (
        <form onSubmit={handlePasswordLogin}>
          <Stack>
            <TextInput
              label="Email address"
              placeholder="hello@gmail.com"
              size="md"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              name="email"
              id="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              size="md"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              name="password"
              id="password"
            />
            {errorString && (
              <Text ta="center" size="sm" c="red">
                {errorString}
              </Text>
            )}
            <Button
              type="submit"
              size="md"
              fullWidth
              loading={loading}
              loaderProps={{ type: "dots" }}
            >
              Login
            </Button>
            <Text ta="center" c="dimmed" size="sm">
              New here?{" "}
              <Anchor onClick={() => router.push("/signup")} component="button">
                Sign up for access!
              </Anchor>
            </Text>
          </Stack>
        </form>
      )}
    </Container>
  );
}
