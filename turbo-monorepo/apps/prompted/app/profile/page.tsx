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
  Loader,
  Center,
} from "@mantine/core";
import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getEntries, isUserLoggedIn } from "./action";
import Charts from "../progress/components/charts";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState(null);

  // Check if the user is logged in using Supabase
  useEffect(() => {
    const handleCheckedLoggedIn = async () => {
      const { isLoggedIn, email, username } = await isUserLoggedIn();
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        const entriesData = await getEntries();
        setEntries(entriesData);
        setEmail(email);
        setUserName(username);
        setLoading(false); // Stop loading once user data is fetched
      }
    };
    handleCheckedLoggedIn();
  }, [router]);

  const handleResetPassword = () => {
    // Redirect to the password reset flow
    router.push("/reset-password");
  };

  // Show loading spinner if user data is not yet fetched
  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg" mt="lg">
      <Grid gutter="lg" h={"100%"}>
        {/* Left Section: User Information */}
        <Grid.Col>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group align="center" justify="space-between" mb="md">
              <div>
                <Title order={3}>Hi There, {username}!</Title>
                It seems that your profile is not filled out at the moment,
                click here to do so.
              </div>

              <div>
                <Text c="dimmed">{email}</Text>
                <Button
                  leftSection={<FaLock />}
                  mt="lg"
                  variant="outline"
                  color="red"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
              </div>
            </Group>
          </Card>
        </Grid.Col>

        {/* Right Section: Sidebar Content */}
        <Grid.Col flex={1}>
          <Paper shadow="sm" radius="md" p="lg" withBorder>
            <Charts entries={entries} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
