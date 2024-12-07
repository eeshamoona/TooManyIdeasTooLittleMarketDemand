import { Accordion, Container, Grid, Image } from "@mantine/core";
import image from "../../public/images/FAQ.png";
import { faqData } from "./data";

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
