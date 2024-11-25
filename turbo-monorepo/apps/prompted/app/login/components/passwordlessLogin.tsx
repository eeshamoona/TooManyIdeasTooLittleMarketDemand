import React, { useState } from "react";
import { Stack, TextInput, Text, Button } from "@mantine/core";
import { LuSparkles } from "react-icons/lu";
import { magicLinkLogin } from "../actions";

const MagicLinkForm: React.FC = () => {
  const [email, setEmail] = useState("");
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
  return (
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
          variant="light"
          loading={loading}
          leftSection={<LuSparkles aria-label="Magic Link Icon" />}
          mt="xs"
        >
          Get Magic Link
        </Button>
      </Stack>
    </form>
  );
};

export default MagicLinkForm;
