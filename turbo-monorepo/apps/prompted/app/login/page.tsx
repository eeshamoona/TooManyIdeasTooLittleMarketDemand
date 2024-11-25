"use client";
import React, { useState } from "react";
import {
  Title,
  Container,
  Stack,
  Text,
  Anchor,
  Group,
  Divider,
  Image,
  rem,
  Tabs,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Footer from "../components/footer";
import { useMediaQuery } from "@mantine/hooks";
import loginImage from "../../public/WritingRoom.png";
import PasswordForm from "./components/passwordLogin";
import MagicLinkForm from "./components/passwordlessLogin";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMagicLinkForm, setShowMagicLinkForm] = useState(true);
  const [errorString, setErrorString] = useState<string | null>(null);
  const isMediumScreen = useMediaQuery("(max-width: 930px)");

  const switchToSignup = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    router.replace("/signup");
  };

  const iconStyle = { width: rem(12), height: rem(12) };

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

        <Stack flex={1} h="100%" mt="lg">
          <Tabs variant="pills" defaultValue="magic-link">
            <Tabs.List grow justify="center">
              <Tabs.Tab value="magic-link">Send Magic Link</Tabs.Tab>
              <Tabs.Tab value="password">Use Password</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel py="md" value="magic-link">
              <MagicLinkForm />
            </Tabs.Panel>

            <Tabs.Panel py="md" value="password">
              <PasswordForm />
            </Tabs.Panel>
          </Tabs>
          <Text ta="center" c="dimmed" size="sm">
            New here?{" "}
            <Anchor onClick={() => router.push("/signup")} component="button">
              Sign up for access!
            </Anchor>
          </Text>
        </Stack>
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
