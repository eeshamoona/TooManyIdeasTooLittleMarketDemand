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
      }
    };
    handleCheckedLoggedIn();
    console.log(profile);
  }, []);

  const handleResetPassword = () => {
    // Redirect to the password reset flow
    router.push("/reset-password");
  };

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Charts
          entries={entries}
          profile={profile}
          username={username}
          email={email}
        />
        <Button
          leftSection={<FaLock />}
          variant="outline"
          color="red"
          fullWidth
          onClick={handleResetPassword}
        >
          Reset Password
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
