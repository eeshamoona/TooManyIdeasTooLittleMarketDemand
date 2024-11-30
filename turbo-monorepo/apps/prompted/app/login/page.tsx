"use client";
import {
  Anchor,
  Container,
  Divider,
  Group,
  Image,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React from "react";
import { FaKey } from "react-icons/fa";
import { LuSparkle } from "react-icons/lu";
import loginImage from "../../public/WritingRoom.png";
import Footer from "../components/footer";
import PasswordForm from "./components/passwordLogin";
import MagicLinkForm from "./components/passwordlessLogin";

export default function LoginPage() {
  const router = useRouter();
  const isMediumScreen = useMediaQuery("(max-width: 930px)");

  const switchToSignUp = (
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
        Login to your account and keep the creativity flowing
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
          <Tabs variant="pills" defaultValue="password">
            <Tabs.List grow justify="center">
              <Tabs.Tab value="password" leftSection={<FaKey />}>
                Use Password
              </Tabs.Tab>
              <Tabs.Tab value="magic-link" leftSection={<LuSparkle />}>
                Send Magic Link
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel pt="md" value="password">
              <PasswordForm />
            </Tabs.Panel>
            <Tabs.Panel pt="md" value="magic-link">
              <MagicLinkForm />
            </Tabs.Panel>
          </Tabs>
          <Text ta="center" c="dimmed" size="sm">
            New here?{" "}
            <Anchor onClick={switchToSignUp} component="button">
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
