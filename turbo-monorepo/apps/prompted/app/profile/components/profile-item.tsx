import { Group, Paper, Text, ThemeIcon } from "@mantine/core";
import React from "react";

interface ProfileItemProps {
  icon: React.ComponentType<any>;
  label: string;
  title: string;
  description: string;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
  icon: ItemIcon,
  label,
  title,
  description,
}) => (
  <Paper p="md" radius="sm" withBorder h="100%">
    <Text size="xs" ta="center" tt="uppercase" mb={4} fw={500} c="dimmed">
      {title}
    </Text>
    <Group wrap="nowrap" h="100%" gap="xl" align="center">
      {ItemIcon && (
        <ThemeIcon size="lg" variant="light" color="blue">
          <ItemIcon />
        </ThemeIcon>
      )}
      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500} mb={4}>
          {label}
        </Text>
        <Text size="xs" c="dimmed" lineClamp={2}>
          {description}
        </Text>
      </div>
    </Group>
  </Paper>
);
