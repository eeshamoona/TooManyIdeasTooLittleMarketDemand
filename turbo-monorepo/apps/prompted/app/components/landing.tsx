import { Button, Container, Stack, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { FaArrowRight } from "react-icons/fa";
import { usePrompts } from "../context/PromptContext";
import Loading from "../loading";
import { TypewriterArray } from "./typewriter";

// Lazy load the components
const HeroPage = React.lazy(() => import("./hero"));
const HowItWorks = React.lazy(() => import("./how"));
const FeatureHighlight = React.lazy(() => import("./motivation"));
const FaqWithImage = React.lazy(() => import("./faq"));
const Footer = React.lazy(() => import("./footer"));

const LandingPage: React.FC = () => {
  const router = useRouter();

  // Check if screen is mobile (40em ~ 640px)
  const isMobile = useMediaQuery("(max-width: 40em)", true, {
    getInitialValueInEffect: false,
  });

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      const headerOffset = 7 * 16; // 10rem in pixels
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.screenY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const goToLogin = () => {
    router.push("/write");
  };

  const { prompts } = usePrompts();
  const displayPrompts = prompts.map((prompt) => prompt.text);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <FullHeightSection>
          <HeroPage
            scrollToCallback={scrollToHowItWorks}
            goToLoginCallback={goToLogin}
          />
        </FullHeightSection>

        {!isMobile && (
          <Stack
            gap="sm"
            align="center"
            style={{
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <Title ta="center">Get inspired with prompts like...</Title>
            <TypewriterArray strings={displayPrompts} />
          </Stack>
        )}

        <FullHeightSection id="how-it-works">
          <HowItWorks />
        </FullHeightSection>

        <FullHeightSection
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <FeatureHighlight />
          <Button
            size="lg"
            variant="light"
            color="blue"
            rightSection={<FaArrowRight />}
            onClick={goToLogin}
          >
            Sign up for free and get started today
          </Button>
        </FullHeightSection>

        <FullHeightSection>
          <FaqWithImage />
        </FullHeightSection>

        <footer>
          <Footer />
        </footer>
      </Suspense>
    </>
  );
};

interface FullHeightSectionProps {
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

const FullHeightSection: React.FC<FullHeightSectionProps> = ({
  children,
  id,
  style,
}) => {
  return (
    <Container
      fluid
      id={id}
      style={{
        minHeight: "90vh",
        ...style,
      }}
    >
      {children}
    </Container>
  );
};

export default LandingPage;
