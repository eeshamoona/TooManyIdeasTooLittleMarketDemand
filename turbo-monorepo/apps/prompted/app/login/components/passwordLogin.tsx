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
  const [magicLinkSent, setMagicLinkSet] = useState<boolean>(false);

  const handlePasswordLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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

    if (!password) {
      setErrorString("Please enter your password.");
      return;
    }

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);
    console.log("Result", result);
    if (typeof result === "string") {
      if (result === "INCORRECT_PASSWORD") {
        setErrorString("Incorrect password.");
        setLoading(false);
      } else if (result === "EMAIL_PASSWORD_REQUIRED") {
        setErrorString("Email and password are required.");
        setLoading(false);
      } else if (result === "EMAIL_NOT_REGISTERED") {
        setErrorString("Email not registered, please sign up");
        setLoading(false);
      }else {
        console.error("An unknown error occurred in handle Magic Link");
        setErrorString("An unexpected error occurred. Please try again later.");
      }
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
            {errorString}
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
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default PasswordForm;
