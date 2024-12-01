import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbUnlink } from "react-icons/tb";
import { magicLinkLogin } from "../actions";

const MagicLinkForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

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
        setErrorString(null);
        router.push("/check-email?type=magic-link");
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
        <Button
          type="submit"
          size="md"
          fullWidth
          variant="light"
          loading={loading}
          loaderProps={{ type: "dots" }}
          leftSection={<TbUnlink aria-label="Magic Link Icon" />}
          mt="xs"
        >
          Get Magic Link
        </Button>
      </Stack>
    </form>
  );
};

export default MagicLinkForm;
