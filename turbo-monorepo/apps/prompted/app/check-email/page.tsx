"use client";
import React from "react";
import { Container, Button, Group, Card } from "@mantine/core";
import { useSearchParams, useRouter } from "next/navigation";
import SignupContent from "./components/signupContent";
import PasswordResetContent from "./components/passwordResetContent";
import MagicLinkContent from "./components/magicLinkContent";
import DefaultContent from "./components/defaultContent";

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
