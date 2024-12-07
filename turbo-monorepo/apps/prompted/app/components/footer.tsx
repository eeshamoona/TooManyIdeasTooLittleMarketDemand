import {
  Anchor,
  Box,
  Divider,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  const theme = useMantineTheme();
  return (
    <Box py={20} style={{ textAlign: "center" }}>
      <Divider my="sm" />
      <Text size="sm" c="dimmed">
        Prompted last updated on{" "}
        {new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        by <Anchor href="https://github.com/eeshamoona">Eesha Moona</Anchor>
      </Text>
      <Group mt={10} justify="center" gap="lg">
        <Group gap="6">
          <FaGithub color={theme.colors.gray[6]} />
          <Text
            component="a"
            href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/tree/main/turbo-monorepo/apps/prompted"
            size="sm"
            c="dimmed"
            target="_blank"
            ta="center"
          >
            Repository
          </Text>
        </Group>

        <Group gap="6">
          <FaLinkedin color={theme.colors.gray[6]} />
          <Text
            component="a"
            href="https://www.linkedin.com/in/eeshamoona/"
            size="sm"
            c="dimmed"
            target="_blank"
            ta="center"
          >
            Developer
          </Text>
        </Group>

        <Group gap="6">
          <FaGithub color={theme.colors.gray[6]} />
          <Text
            component="a"
            href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/discussions/66"
            size="sm"
            c="dimmed"
            target="_blank"
            ta="center"
          >
            Discussion Board
          </Text>
        </Group>
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
