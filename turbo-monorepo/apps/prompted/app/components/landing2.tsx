import React, { useEffect, useState } from "react";
import { Button, Group, Container } from "@mantine/core";
import { FaqWithImage } from "./faq";
import Footer from "./footer";
import { HeroPage } from "./hero";
import { HowItWorks } from "./how";
import FeatureHighlight from "./motivation";

const LandingPage: React.FC = () => {
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

  return (
    <>
      <FullHeightSection>
        <HeroPage answerQ1={answerQ1} />
      </FullHeightSection>

      <FullHeightSection>
        <HowItWorks answerQ2={answerQ2} />
      </FullHeightSection>

      <FullHeightSection>
        <FeatureHighlight answerQ4={answerQ4} />
      </FullHeightSection>

      <Group justify="center" my="xl">
        <Button size="lg" variant="filled" color="blue">
          Start Your Writing Journey
        </Button>
      </Group>

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
}

const FullHeightSection: React.FC<FullHeightSectionProps> = ({ children }) => {
  return (
    <Container
      fluid
      style={{
        minHeight: "90vh",
      }}
    >
      {children}
    </Container>
  );
};

export default LandingPage;
