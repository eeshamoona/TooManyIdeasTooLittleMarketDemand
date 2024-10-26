import React from "react";
import { Box, Text, Group, Divider } from "@mantine/core";

const Footer: React.FC = () => {
  return (
    <Box py={20} style={{ textAlign: "center" }}>
      <Divider my="sm" />
      <Text size="sm" c="dimmed">
        &copy; {new Date().getFullYear()} Prompted. All rights reserved.
      </Text>
      <Group mt={10} justify="center" gap="lg">
        <Text component="a" href="#" size="sm" color="dimmed">
          Facebook
        </Text>
        <Text component="a" href="#" size="sm" color="dimmed">
          Twitter
        </Text>
        <Text component="a" href="#" size="sm" color="dimmed">
          Instagram
        </Text>
        <Text component="a" href="#" size="sm" color="dimmed">
          Contact Us
        </Text>
      </Group>
      <Text mt={10} size="xs" color="dimmed">
        <a href="https://storyset.com/business" style={{ color: "inherit" }}>
          Business illustrations by Storyset
        </a>
      </Text>
    </Box>
  );
};

export default Footer;
