import { Group, Paper, Text } from "@mantine/core";
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
  <Paper p="md" radius="sm" withBorder>
    <Group justify="space-between">
      <Text size="sm" ta="center" tt="uppercase" fw={500} c="dimmed">
        {title}
      </Text>
      {ItemIcon && <ItemIcon size="1rem" />}
    </Group>

    <Group align="flex-end" mt={25}>
      <Text size="sm" fw={500}>
        {label}
      </Text>
    </Group>

    <Text size="xs" c="dimmed" lineClamp={2} mt={5}>
      {description}
    </Text>
  </Paper>
);
