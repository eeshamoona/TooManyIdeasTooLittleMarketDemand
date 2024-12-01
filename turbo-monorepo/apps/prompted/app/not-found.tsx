"use client";
import { Button, Container, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import NotFoundImage from "../public/images/NotFound.png";
import Footer from "./components/footer";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <Container size="md">
      <Stack align="center" gap="0" mt="-2rem">
        <Image
          src={NotFoundImage}
          alt="404 Not Found"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "500px",
          }}
        />
        <Title order={2} mt="-3rem">
          Seems like you're lost
        </Title>
        <Text c="dimmed" size="md" ta="center">
          Sorry, the page you are looking for does not exist
        </Text>
        <Button
          mt="md"
          size="md"
          variant="filled"
          onClick={() => router.push("/login")}
        >
          Take Me Home
        </Button>
      </Stack>
      <Footer />
    </Container>
  );
};

export default NotFound;
