"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Center,
  Title,
  Text,
  PasswordInput,
  Group,
  Button,
  Stack,
} from "@mantine/core";
import { isUserLoggedIn } from "./action";
import { FaArrowRight, FaCheck } from "react-icons/fa";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean | null>(null);

  //Check that the user is logged in with supabase
  useEffect(() => {
    const handleCheckedLoggedIn = async () => {
      const { isLoggedIn, email } = await isUserLoggedIn();
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        setEmail(email);
      }
    };
    handleCheckedLoggedIn();
  }, []);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`/api/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response", response);
      if (response.ok) {
        setSuccessMessage(true);
      } else {
        setErrorMessage("Password Reset Failed. Please try again later.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      console.error(error);
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Center>
        <Title order={1} ta="center" mb="lg">
          Reset Password
        </Title>
      </Center>

      {successMessage ? (
        <Stack mt="lg">
          <Group gap="sm" justify="center">
            <FaCheck color="green" />
            <Text ta="center" c="green">
              Password Successfully Updated
            </Text>
          </Group>
          <Button
            variant="light"
            rightSection={<FaArrowRight />}
            onClick={() => router.push("/write")}
          >
            Back to Writing!
          </Button>
        </Stack>
      ) : (
        <>
          <Text ta="center" mb="md">
            Resetting password for: <b>{email}</b>
          </Text>
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            mb="md"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            mb="lg"
          />
          {errorMessage && (
            <Text ta="center" size="sm" c="red">
              {errorMessage}
            </Text>
          )}

          <Group justify="center" mt="lg">
            <Button onClick={handleResetPassword} variant="filled" color="blue">
              Reset Password
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
}
