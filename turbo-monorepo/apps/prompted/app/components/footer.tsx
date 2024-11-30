import React from "react";
import { Box, Text, Group, Divider, useMantineTheme } from "@mantine/core";

const Footer: React.FC = () => {
  const theme = useMantineTheme();
  return (
    <Box py={20} style={{ textAlign: "center" }}>
      <Divider my="sm" />
      <Text size="sm" c="dimmed">
        &copy; {new Date().getFullYear()} Prompted. All rights reserved.
      </Text>
      <Group mt={10} justify="center" gap="lg">
        <Text
          component="a"
          href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/tree/main/turbo-monorepo/apps/prompted"
          size="sm"
          c="dimmed"
        >
          Github
        </Text>
        <Text
          component="a"
          href="https://www.linkedin.com/in/eeshamoona/"
          size="sm"
          c="dimmed"
        >
          Developer
        </Text>
        <Text
          component="a"
          href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/discussions/66"
          size="sm"
          c="dimmed"
        >
          Feedback
        </Text>
      </Group>
      <Text mt={10} size="xs">
        <a
          href="https://storyset.com/business"
          style={{ color: theme.colors.blue[6] }}
        >
          Illustrations by Storyset
        </a>
      </Text>
    </Box>
  );
};

export default Footer;
