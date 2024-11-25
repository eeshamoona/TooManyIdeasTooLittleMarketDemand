import React, { useState } from "react";
import {
  Stack,
  TextInput,
  Text,
  Button,
  Anchor,
  PasswordInput,
} from "@mantine/core";
import { LuLogIn } from "react-icons/lu";
import { login } from "../actions";
import router from "next/router";

const PasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [showResetLink, setShowResetLink] = useState(false); // New state for reset link

  const handlePasswordLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("Handle password login process started.");
    setErrorString(null);
    setShowResetLink(false); // Reset the link visibility

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      console.warn("Email missing during login.");
      setErrorString("Please enter your email.");
      return;
    } else if (!emailPattern.test(email)) {
      console.warn("Invalid email format:", email);
      setErrorString("Please enter a valid email address.");
      return;
    }

    if (!password) {
      console.warn("Password missing during login.");
      setErrorString("Please enter your password.");
      return;
    }

    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const result = await login(formData);

    if (typeof result === "string") {
      console.error("Login error code received:", result);
      if (result === "INCORRECT_PASSWORD") {
        setErrorString("Password incorrect");
        setShowResetLink(true); // Show the reset password link
      } else if (result === "EMAIL_PASSWORD_REQUIRED") {
        setErrorString("Email and password are required.");
      } else if (result === "EMAIL_NOT_REGISTERED") {
        setErrorString("Email not registered, please sign up.");
      } else {
        console.error("Unknown error in handlePasswordLogin:", result);
        setErrorString("An unexpected error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  return (
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
            {errorString}{" "}
            {showResetLink && (
              <Anchor
                href="/reset-password"
                size="sm"
                ta="center"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/reset-password");
                }}
              >
                Need help? Reset it here.
              </Anchor>
            )}
          </Text>
        )}

        <Button
          type="submit"
          size="md"
          fullWidth
          variant="light"
          loading={loading}
          leftSection={<LuLogIn aria-label="Login Icon" />}
          loaderProps={{ type: "dots" }}
          mt="sm"
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default PasswordForm;
