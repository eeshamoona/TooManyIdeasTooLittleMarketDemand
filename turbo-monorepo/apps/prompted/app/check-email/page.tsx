"use client";
import { Button, Card, Container, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import DefaultContent from "./components/defaultContent";
import MagicLinkContent from "./components/magicLinkContent";
import PasswordResetContent from "./components/passwordResetContent";
import SignupContent from "./components/signupContent";

const CheckEmailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // Get the `type` parameter from the URL

  const handleGoBack = () => {
    router.push("/"); // Redirect to the home page or any other page
  };

  const renderContent = () => {
    switch (type) {
      case "signup":
        return <SignupContent />;
      case "password-reset":
        return <PasswordResetContent />;
      case "magic-link":
        return <MagicLinkContent />;
      default:
        return <DefaultContent />;
    }
  };

  return (
    <Container size="xs" style={{ textAlign: "center", marginTop: "5rem" }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {renderContent()}
        <Group justify="center" gap="md">
          <Button variant="filled" onClick={handleGoBack}>
            Back to Home
          </Button>
        </Group>
      </Card>
    </Container>
  );
};

export default CheckEmailPage;
