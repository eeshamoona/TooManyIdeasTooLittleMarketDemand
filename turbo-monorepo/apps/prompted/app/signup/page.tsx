"use client";

import React, { useState } from "react";
import { signup } from "../login/actions";
import {
  Button,
  PasswordInput,
  TextInput,
  Title,
  Container,
  Stack,
  Text,
  Anchor,
  Image,
  Divider,
  Group,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import signupImage from "../../public/SignupCharacter.png";
import Footer from "../components/footer";

export default function SignupPage() {
  const router = useRouter();
  const isMediumScreen = useMediaQuery("(max-width: 800px)");
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
    <>
      <Group w="100%" mt="xl">
        <Divider flex={1} />
        <Title ta="center" order={1}>
          Join the Fun!
        </Title>
        <Divider flex={1} />
      </Group>

      <Text ta="center" c="dimmed" mb="xl">
        Sign up to make writing a joyful habit
      </Text>
      <Container
        size="lg"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "3rem",
          flexWrap: "wrap",
        }}
      >
        <form
          style={{
            width: "50%",
            alignSelf: "center",
          }}
        >
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

        {/* Image Section */}
        {!isMediumScreen && (
          <Image
            src={signupImage.src}
            alt="Signup character"
            style={{
              maxWidth: "30rem",
              width: "100%",
              height: "auto",
            }}
          />
        )}
      </Container>
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <Footer />
      </footer>
    </>
  );
}
