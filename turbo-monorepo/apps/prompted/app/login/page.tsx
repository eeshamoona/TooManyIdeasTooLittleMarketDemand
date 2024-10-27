"use client";
import React, { useState } from "react";
import { login } from "./actions";
import {
  Button,
  PasswordInput,
  TextInput,
  Title,
  Container,
  Stack,
  Text,
  Anchor,
  Group,
  Divider,
  Image,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";
import { useMediaQuery } from "@mantine/hooks";
import loginImage from "../../public/WritingRoom.png";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorString, setErrorString] = useState<string | null>(null);
  const isMediumScreen = useMediaQuery("(max-width: 930px)");

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
    const response = await login(formData);
    if (response) {
      switch (response) {
        case "EMAIL_NOT_VERIFIED":
          setErrorString(
            "This email has not been verified. Please check your email or sign up again."
          );
          break;
        case "INCORRECT_PASSWORD":
          setErrorString("Incorrect password. Please try again.");
          break;
        case "EMAIL_NOT_REGISTERED":
          setErrorString("This email is not registered. Please sign up.");
          break;
        case "UNKNOWN_ERROR":
          setErrorString("An unknown error occurred. Please try again.");
          break;
        default:
          setErrorString("Something went wrong. Please try again.");
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
    <>
      <Group w="100%" mt="xl">
        <Divider flex={1} />
        <Title ta="center" order={1}>
          Let’s Do This!
        </Title>
        <Divider flex={1} />
      </Group>

      <Text ta="center" c="dimmed" mb="xl">
        Login to your account and keep the creativity flowing!
      </Text>

      <Container
        size="lg"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7rem",
          flexWrap: "wrap",
          height: "100%",
        }}
      >
        {!isMediumScreen && (
          <Image
            src={loginImage.src}
            alt="Login Lightbulb"
            style={{
              maxWidth: "20rem",
              width: "100%",
              height: "auto",
            }}
          />
        )}
        <form
          style={{
            width: "50%",
            alignSelf: "center",
          }}
        >
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

            <Button
              size="md"
              fullWidth
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
      </Container>
      <footer
        style={{
          marginTop: "auto",
          bottom: 0,
          position: "absolute",
          width: "100%",
        }}
      >
        <Footer />
      </footer>
    </>
  );
}
