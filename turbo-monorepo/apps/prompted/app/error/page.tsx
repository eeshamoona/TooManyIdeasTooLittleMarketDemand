"use client";
import { Button, Card, Container, Group, Text, Title } from "@mantine/core";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorImage from "../../public/images/ErrorImage.png";
import Footer from "../components/footer";

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("error") ||
    "There was an unexpected error. Please try again.";

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <>
      <Container
        size="sm"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          p="xl"
          radius="md"
          style={{ maxWidth: "27rem", textAlign: "center" }}
        >
          <Image
            src={ErrorImage}
            alt="Error"
            style={{ width: "100%", height: "auto" }}
          />
          <Title order={2}>Oops! An Error Occurred</Title>
          <Text mb="md">{errorMessage}</Text>
          <Group justify="center" mt="md">
            <Button
              component="a"
              variant="outline"
              href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/discussions/66"
              target="_blank"
              color="blue"
            >
              Send Feedback
            </Button>
            <Button onClick={handleBackToHome} color="blue">
              Back to Home
            </Button>
          </Group>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
