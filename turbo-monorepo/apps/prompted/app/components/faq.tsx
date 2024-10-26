import { Image, Accordion, Grid, Container, Title } from "@mantine/core";
import image from "../../public/FAQs-rafiki.png";

const placeholder =
  "It can’t help but hear a pin drop from over half a mile away, so it lives deep in the mountains where there aren’t many people or Pokémon.";

const faqData = [
  {
    value: "reset-password",
    question: "How can I reset my password?",
    answer: placeholder,
  },
  {
    value: "another-account",
    question: "Can I create more than one account?",
    answer: placeholder,
  },
  {
    value: "newsletter",
    question: "How can I subscribe to the monthly newsletter?",
    answer: placeholder,
  },
  {
    value: "credit-card",
    question: "Do you store credit card information securely?",
    answer: placeholder,
  },
];

export function FaqWithImage() {
  return (
    <div>
      <Container size="lg">
        <Title order={2} ta="center">
          Frequently Asked Questions
        </Title>
        <Grid id="faq-grid" gutter={50} align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Image src={image.src} alt="Frequently Asked Questions" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Accordion
              chevronPosition="right"
              defaultValue="reset-password"
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
    </div>
  );
}
