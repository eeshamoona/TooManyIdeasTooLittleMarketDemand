import {
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LuLogIn } from "react-icons/lu";
import { login, passwordResetLink } from "../actions";

const PasswordForm: React.FC = () => {
  const router = useRouter();
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

  const handlePasswordReset = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Handle password reset.");
    const formData = new FormData();
    formData.append("email", email);
    const result = await passwordResetLink(formData);

    console.log("Result from handlePasswordReset", result);
    if (result === "RESET_LINK_SENT") {
      setErrorString(null);
      setShowResetLink(false);
      router.push("/check-email?type=password-reset");
    } else if (result === "EMAIL_REQUIRED") {
      setErrorString("Email is required.");
    } else if (result === "EMAIL_NOT_REGISTERED") {
      setErrorString("Email not registered, please sign up.");
    } else if (result === "RESET_LINK_ERROR") {
      setErrorString("There was an error sending your reset link");
    } else {
      console.error("Unknown error in handlePasswordReset:", result);
      setErrorString("An unexpected error occurred. Please try again later.");
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
              <Anchor size="sm" ta="center" onClick={handlePasswordReset}>
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
