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
        <Text component="a" href="#" size="sm" c="dimmed">
          Github
        </Text>
        <Text component="a" href="#" size="sm" c="dimmed">
          Twitter
        </Text>
        <Text component="a" href="#" size="sm" c="dimmed">
          Instagram
        </Text>
        <Text component="a" href="#" size="sm" c="dimmed">
          Contact Us
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
