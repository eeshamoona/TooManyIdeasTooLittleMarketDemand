import React, { useEffect, useState } from "react";
import { Button, Container } from "@mantine/core";
import { FaqWithImage } from "./faq";
import Footer from "./footer";
import { HeroPage } from "./hero";
import { HowItWorks } from "./how";
import FeatureHighlight from "./motivation2";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [answerQ1, setAnswerQ1] = useState<string | null>(null);
  const [answerQ2, setAnswerQ2] = useState<string | null>(null);
  const [answerQ3, setAnswerQ3] = useState<string | null>(null);
  const [answerQ4, setAnswerQ4] = useState<string | null>(null);

  useEffect(() => {
    const quizAnswers = localStorage.getItem("quizAnswers");
    if (quizAnswers) {
      const answers = JSON.parse(quizAnswers);
      setAnswerQ1(answers?.Q1 || null);
      setAnswerQ2(answers?.Q2 || null);
      setAnswerQ3(answers?.Q3 || null);
      setAnswerQ4(answers?.Q4 || null);
    }
  }, []);

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

  return (
    <>
      <FullHeightSection>
        <HeroPage
          answerQ1={answerQ1}
          scrollToCallback={scrollToHowItWorks}
          goToLoginCallback={goToLogin}
        />
      </FullHeightSection>

      <FullHeightSection id="how-it-works">
        <HowItWorks answerQ2={answerQ2} />
      </FullHeightSection>

      <FullHeightSection
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <FeatureHighlight answerQ4={answerQ4} />
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
