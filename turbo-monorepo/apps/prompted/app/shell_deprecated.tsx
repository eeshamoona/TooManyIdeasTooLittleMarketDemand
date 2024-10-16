"use client";
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Avatar,
  useMantineColorScheme,
  ActionIcon,
} from "@mantine/core";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IoExitOutline } from "react-icons/io5";
import { HiChevronDown, HiChevronLeft } from "react-icons/hi2";
import { LuBookOpen, LuPlusCircle, LuPencil, LuAward } from "react-icons/lu";

interface CustomAppShellProps {
  metadata: any;
  isLoggedIn: boolean;
  children: React.ReactNode;
}

import { forwardRef, useState } from "react";
import { Menu } from "@mantine/core";
import { handleLogout } from "./logout/logoutClient";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, icon, onClick, ...others }: UserButtonProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(!isOpen);
      if (onClick) onClick(e);
    };

    return (
      <UnstyledButton
        ref={ref}
        style={{
          color: "var(--mantine-color-text)",
          borderRadius: "var(--mantine-radius-sm)",
        }}
        {...others}
        onClick={handleClick}
      >
        <Group gap="4px" mr={"2px"}>
          <Avatar key={name} name={name} color="initials" radius="sm" />
          {icon ||
            (isOpen ? (
              <HiChevronDown size="1rem" />
            ) : (
              <HiChevronLeft size="1rem" />
            ))}
        </Group>
      </UnstyledButton>
    );
  },
);

function UserMenu({ username }: { username: string }) {
  const [menuOpened, setMenuOpened] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setMenuOpened((prev) => !prev);
  };

  return (
    <Menu
      position="bottom-end"
      offset={0}
      withArrow
      opened={menuOpened}
      onClose={() => setMenuOpened(false)}
    >
      <Menu.Target>
        <UserButton name={username} onClick={handleMenuToggle} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>

        <Menu.Item
          leftSection={<LuAward style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/progress")}
        >
          My Progress
        </Menu.Item>
        <Menu.Item
          leftSection={<LuPencil style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/write")}
        >
          Write
        </Menu.Item>
        <Menu.Item
          leftSection={
            <LuPlusCircle style={{ width: "1rem", height: "1rem" }} />
          }
          onClick={() => router.push("/write/more")}
        >
          Add More
        </Menu.Item>
        <Menu.Item
          leftSection={<LuBookOpen style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/read")}
        >
          Read
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={
            <IoExitOutline style={{ width: "1rem", height: "1rem" }} />
          }
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
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
            <Group gap={"4px"}>
              {isLoggedIn && <UserMenu username={metadata.username} />}
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="subtle"
                size={37.5}
                color={colorScheme === "dark" ? "yellow" : "violet"}
                radius="sm"
                aria-label="Toggle color scheme"
              >
                {colorScheme === "dark" ? (
                  <FaSun style={{ color: "var(--mantine-color-yellow-5)" }} />
                ) : (
                  <FaMoon style={{ color: "var(--mantine-color-indigo-9)" }} />
                )}
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
