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
  Stack,
  ThemeIcon,
  SimpleGrid,
  Slider,
} from "@mantine/core";
import { FaLock, FaBook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getData, isUserLoggedIn } from "./action";
import Charts from "./components/charts";
import { profileQuizQuestions } from "../profile-quiz/constants";

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

  const renderProfileDetails = () => {
    if (!profile) return null;

    const findOptionDetails = (questionKey: string, value: string) => {
      const question = profileQuizQuestions.find(
        (q) => q.question === questionKey
      );
      const option = question?.options.find((opt) => opt.value === value);
      return {
        label: option?.label || value,
        description: option?.description || "",
        Icon: option?.icon,
      };
    };

    const { wordCount, ...otherDetails } = profile;

    const getWordCountDescription = (count: number) => {
      const descriptions = [
        { threshold: 100, text: "Brief Response - Perfect for quick thoughts" },
        {
          threshold: 350,
          text: "Short Article - Ideal for clear, concise ideas",
        },
        {
          threshold: 650,
          text: "Full Article - Room to develop your thoughts",
        },
        { threshold: 850, text: "In-Depth Piece - Space for rich detail" },
        {
          threshold: Infinity,
          text: "Comprehensive Essay - Full exploration of your topic",
        },
      ];

      return descriptions.find((d) => count <= d.threshold)?.text;
    };

    const ProfileItem = ({ icon: ItemIcon, label, title, description }) => (
      <Paper p="md" radius="sm" withBorder>
        <Group wrap="nowrap" gap="xl">
          {ItemIcon && (
            <ThemeIcon size="lg" variant="light" color="blue">
              <ItemIcon size={20} />
            </ThemeIcon>
          )}
          <div style={{ flex: 1 }}>
            <Text size="xs" tt="uppercase" fw={500} c="dimmed">
              {title}
            </Text>
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

    return (
      <Stack gap="xl">
        {wordCount && (
          <ProfileItem
            icon={FaBook}
            title="Target Word Count"
            label={`${wordCount} words`}
            description={getWordCountDescription(wordCount)}
          />
        )}

        {Object.entries(otherDetails).map(([key, value]) => {
          const { label, description, Icon } = findOptionDetails(
            key,
            value as string
          );
          return (
            <ProfileItem
              key={key}
              icon={Icon}
              title={key.replace(/([A-Z])/g, " $1").trim()}
              label={label}
              description={description}
            />
          );
        })}
      </Stack>
    );
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
    <Container size="xl" py="xl">
      <Grid gutter="xl">
        {/* Left Section: User Information */}
        <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack justify="space-between" h="100%" gap="xl">
              <Stack gap="md">
                <div>
                  <Title order={3} mb={4}>
                    Hey there, {username}!
                  </Title>
                  <Text size="sm" c="dimmed">
                    {email}
                  </Text>
                </div>

                {profile?.length === 0 ? (
                  <Paper p="md" withBorder>
                    <Text mb="md">
                      It seems that your profile is not filled out at the
                      moment, click here to do so.
                    </Text>
                    <Button
                      onClick={() => router.push("/profile-quiz")}
                      variant="filled"
                      fullWidth
                    >
                      Fill Out Profile
                    </Button>
                  </Paper>
                ) : (
                  renderProfileDetails()
                )}
              </Stack>
              <Button
                leftSection={<FaLock />}
                variant="light"
                color="red"
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Right Section: Charts */}
        <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
          <Paper shadow="sm" radius="md" p="xl" withBorder>
            <Charts entries={entries} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
