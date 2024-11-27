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
import { getData, isUserLoggedIn } from "./action";
import Charts from "../progress/components/charts";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState(null);
  const [profile, setProfile] = useState(null);

  // Check if the user is logged in using Supabase
  useEffect(() => {
    const handleCheckedLoggedIn = async () => {
      const { isLoggedIn, email, username, userId } = await isUserLoggedIn();
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        const { entries: entriesData, profile: profileData } =
          await getData(userId);
        setEntries(entriesData);
        setProfile(profileData);
        setEmail(email);
        setUserName(username);
        setLoading(false); // Stop loading once user data is fetched
      }
    };
    handleCheckedLoggedIn();
    console.log(profile);
  }, []);

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
                <Title order={3}>Hey there, {username}!</Title>
                {profile.length === 0 ? (
                  <>
                    <Text>
                      It seems that your profile is not filled out at the
                      moment, click here to do so.
                    </Text>
                    <Button
                      onClick={() => router.push("/profile-quiz")}
                      mt="md"
                      variant="filled"
                    >
                      Fill Out Profile
                    </Button>
                  </>
                ) : (
                  <Text>{JSON.stringify(profile)}</Text>
                )}
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
