"use client";
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Avatar,
  Button,
  useMantineColorScheme,
  ActionIcon,
} from "@mantine/core";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { handleLogout } from "./logout/logoutClient";
import { useRouter } from "next/navigation";

interface CustomAppShellProps {
  metadata: any;
  isLoggedIn: boolean;
  children: React.ReactNode;
}

export function CustomAppShell({
  metadata,
  isLoggedIn,
  children,
}: CustomAppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const router = useRouter();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group gap={0} visibleFrom="sm">
              <UnstyledButton onClick={() => router.push("/")}>
                Prompted
              </UnstyledButton>
            </Group>
            <Group>
              {isLoggedIn && (
                <Group>
                  <Avatar
                    key={metadata.username}
                    name={metadata.username}
                    color="initials"
                    radius="xl"
                  />
                  <Button variant="outline" color="red" onClick={handleLogout}>
                    Logout
                  </Button>
                </Group>
              )}
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="default"
                size="lg"
                aria-label="Toggle color scheme"
              >
                {colorScheme === "dark" ? <FaSun /> : <FaMoon />}
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton>Home</UnstyledButton>
        <UnstyledButton>Blog</UnstyledButton>
        <UnstyledButton>Contacts</UnstyledButton>
        <UnstyledButton>Support</UnstyledButton>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
