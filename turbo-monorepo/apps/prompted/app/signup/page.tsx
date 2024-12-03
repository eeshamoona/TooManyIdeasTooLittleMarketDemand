"use client";
import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Image,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import loginImage from "../../public/SignupCharacter.png";
import Footer from "../components/footer";
import { magicLinkSignUp, signup } from "../login/actions";

export default function SignupPage() {
  const router = useRouter();
  const isMediumScreen = useMediaQuery("(max-width: 995px)");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log("Signup process started."); // Debug start
    setErrorString(null); // Reset error state

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username) {
      console.warn("Username missing during signup."); // Log missing username
      setErrorString("Please enter a username.");
      return;
    }

    if (!email) {
      console.warn("Email missing during signup."); // Log missing email
      setErrorString("Please enter your email.");
      return;
    } else if (!emailPattern.test(email)) {
      console.warn("Invalid email format:", email); // Log invalid email format
      setErrorString("Please enter a valid email address.");
      return;
    }

    if (password && password.length < 6) {
      console.warn("Password too short during signup."); // Log short password
      setErrorString("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const formData = new FormData(event.currentTarget.form as HTMLFormElement);
    let result: string | void;

    if (!password) {
      console.log("Proceeding with magic link signup."); // Log signup method
      result = await magicLinkSignUp(formData);
    } else {
      console.log("Proceeding with password signup."); // Log signup method
      result = await signup(formData);
    }

    setLoading(false);
    console.log("Signup process completed."); // Debug completion

    if (typeof result === "string") {
      console.error("Signup error code received:", result); // Log error code
      if (result === "EMAIL_USERNAME_REQUIRED") {
        setErrorString("Please provide both a username and an email address.");
      } else if (result === "ALREADY_REGISTERED") {
        setErrorString("This email is already registered. Please log in.");
      } else if (result === "SIGNUP_ERROR") {
        setErrorString("An error occurred during signup. Please try again.");
      } else {
        console.error("Unknown error in handleSignup:", result); // Log unknown error
        setErrorString("An unexpected error occurred. Please try again later.");
      }
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
          gap: "4rem",
          flexWrap: "wrap",
          height: "100%",
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
              required={true}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <TextInput
              label="Email address"
              placeholder="prompted@gmail.com"
              size="md"
              id="email"
              name="email"
              type="email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Password"
              placeholder="[Optional] Secret Password"
              description="Tired of remembering passwords? Skip this and login with just your email"
              size="md"
              id="password"
              name="password"
              value={password}
              required={false}
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
            src={loginImage.src}
            alt="Login Lightbulb"
            style={{
              maxWidth: "25rem",
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
