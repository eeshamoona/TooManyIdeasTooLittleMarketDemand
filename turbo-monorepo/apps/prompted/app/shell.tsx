"use client";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { IoExitOutline } from "react-icons/io5";
import { LuAward, LuBookOpen, LuPencil } from "react-icons/lu";
import { handleLogout } from "./logout/logoutClient";

interface CustomAppShellProps {
  metadata: any;
  isLoggedIn: boolean;
  children: React.ReactNode;
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, onClick, ...others }: UserButtonProps, ref) => {
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
        </Group>
      </UnstyledButton>
    );
  }
);

function UserMenu({ username }: { username: string }) {
  const [menuOpened, setMenuOpened] = useState(false);
  const router = useRouter();

  const handleMenuToggle = () => {
    setMenuOpened((prev) => !prev);
  };

  return (
    <Menu
      offset={7}
      withArrow
      opened={menuOpened}
      radius={"sm"}
      onClose={() => setMenuOpened(false)}
    >
      <Menu.Target>
        <UserButton name={username} onClick={handleMenuToggle} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<LuBookOpen style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/profile")}
        >
          My Profile
        </Menu.Item>

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
  const theme = useMantineTheme();
  const pathname = usePathname();
  const [textColor, setTextColor] = useState("");

  const backgroundColor = colorScheme === "dark" ? "yellow" : "indigo";

  const isActive = (path: string) => pathname === path;

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
          {isLoggedIn && (
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          )}
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group
              onClick={() => router.push("/")}
              onMouseEnter={() => setTextColor(theme.colors.blue[7])}
              onMouseLeave={() => setTextColor("")}
              style={{
                cursor: "pointer",
              }}
            >
              <Text style={{ color: textColor }}>Prompted</Text>
            </Group>
            {isLoggedIn && (
              <Group gap={"sm"} visibleFrom="sm">
                <Button
                  variant={isActive("/write") ? "light" : "subtle"}
                  leftSection={
                    <LuPencil style={{ width: "1rem", height: "1rem" }} />
                  }
                  onClick={() => router.push("/write")}
                >
                  Write
                </Button>
                <Button
                  variant={isActive("/read") ? "light" : "subtle"}
                  leftSection={
                    <LuBookOpen style={{ width: "1rem", height: "1rem" }} />
                  }
                  onClick={() => router.push("/read")}
                >
                  Read
                </Button>

                <Button
                  variant={isActive("/progress") ? "light" : "subtle"}
                  leftSection={
                    <LuAward style={{ width: "1rem", height: "1rem" }} />
                  }
                  onClick={() => router.push("/progress")}
                >
                  Progress
                </Button>
              </Group>
            )}
            <Group>
              {isLoggedIn ? (
                <Group gap={"sm"} visibleFrom="sm">
                  <Tooltip
                    label="Share Feedback"
                    position="bottom"
                    withArrow
                    offset={9}
                  >
                    <ActionIcon
                      variant="subtle"
                      size="lg"
                      component="a"
                      href="https://github.com/eeshamoona/TooManyIdeasTooLittleMarketDemand/discussions/66"
                      target="_blank"
                    >
                      <GoCommentDiscussion
                        style={{
                          width: "1rem",
                          height: "1rem",
                        }}
                      />
                    </ActionIcon>
                  </Tooltip>
                  <UserMenu username={metadata.username} />
                </Group>
              ) : (
                <Group>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => router.push("/signup")}
                  >
                    Sign Up
                  </Button>
                  <Button
                    size="xs"
                    variant="filled"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </Button>
                </Group>
              )}
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="transparent"
                size={37.5}
                radius="sm"
                c={backgroundColor}
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

      <AppShell.Navbar py="md" px={4}>
        <Button
          variant={isActive("/write") ? "filled" : "light"}
          leftSection={<LuPencil style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/write")}
        >
          Write
        </Button>
        <Button
          variant={isActive("/read") ? "filled" : "light"}
          leftSection={<LuBookOpen style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/read")}
        >
          Read
        </Button>
        <Button
          variant={isActive("/progress") ? "filled" : "light"}
          leftSection={<LuAward style={{ width: "1rem", height: "1rem" }} />}
          onClick={() => router.push("/progress")}
        >
          Progress
        </Button>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
