import { Image, Accordion, Grid, Container } from "@mantine/core";
import image from "../../public/FAQs-rafiki.png";

const faqData = [
  {
    value: "prompt-authors",
    question: "Who writes the prompts?",
    answer:
      "The prompts are crafted by the Prompted team to spark creativity and self-reflection. We focus on universal questions that anyone can enjoy. In the future, we might add AI-generated prompts or let the community contribute.",
  },
  {
    value: "application-developer",
    question: "Who developed this application?",
    answer:
      "Prompted was created by Eesha Moona, a software engineer. The app is built with Next.js, React, and Mantine, deployed on Vercel, and uses Supabase for authentication and database management.",
  },
  {
    value: "data-privacy",
    question: "How is my data handled?",
    answer:
      "We use Supabase to manage data securely, with encryption for data in transit and at rest. We only store what's necessary, and for AI interactions, no personal info is included—just the relevant text.",
  },
  {
    value: "feedback-suggestions",
    question: "How can I provide feedback or suggest new features?",
    answer:
      "You can share feedback or suggest features by creating an Issue on our GitHub. It helps us track and prioritize community suggestions. We appreciate your support!",
  },
  {
    value: "subscription-plans",
    question: "Are there any subscription plans or in-app purchases?",
    answer:
      "Right now, Prompted is free with no in-app purchases. We want to keep it accessible for everyone. Down the road, we may add premium features for more tools and insights.",
  },
  {
    value: "ai-usage",
    question: "How does the app use AI?",
    answer:
      "AI helps in two ways: giving writing suggestions and providing feedback. For suggestions, it uses the last 500 characters of your text to help with writer's block. Feedback analyzes the final submission, keeping your identity private.",
  },
];

export default function FaqWithImage() {
  return (
    <Container pt="xl" mt="lg">
      <Grid id="faq-grid" gutter={50} align="center">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Image src={image.src} alt="Frequently Asked Questions" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Accordion
            chevronPosition="right"
            defaultValue="prompt-authors"
            variant="separated"
          >
            {faqData.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>{item.question}</Accordion.Control>
                <Accordion.Panel>{item.answer}</Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
