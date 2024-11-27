"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  Title,
  Text,
  Button,
  Group,
  Paper,
} from "@mantine/core";
import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "./action";

const ProfilePage: React.FC = async () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUserName] = useState<string | null>(null);

  //Check that the user is logged in with supabase
  useEffect(() => {
    const handleCheckedLoggedIn = async () => {
      const { isLoggedIn, email, username } = await isUserLoggedIn();
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        setEmail(email);
        setUserName(username);
      }
    };
    handleCheckedLoggedIn();
  }, []);

  const handleResetPassword = () => {
    // Redirect to the password reset flow or trigger modal
    router.push("/reset-password");
  };

  return (
    <Container size="lg" mt="lg">
      <Grid gutter="lg" h={"100%"}>
        {/* Left Section: User Information */}
        <Grid.Col span={3}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group align="center" mb="md">
              <div>
                <Title order={3}>{username}</Title>
                <Text c="dimmed">{email}</Text>
              </div>
            </Group>

            <Button
              leftSection={<FaLock />}
              mt="lg"
              variant="outline"
              color="blue"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </Card>
        </Grid.Col>

        {/* Right Section: Sidebar Content */}
        <Grid.Col span={8}>
          <Paper shadow="sm" radius="md" p="lg" withBorder>
            <Title order={4} mb="md">
              Activity Insights
            </Title>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
