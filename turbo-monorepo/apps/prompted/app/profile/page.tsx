"use client";
import { Button, Container } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { getData, isUserLoggedIn } from "./actions";
import Charts from "./components/charts";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUserName] = useState<string | null>(null);
  const [entries, setEntries] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleCheckedLoggedIn = async () => {
      try {
        setLoading(true);
        const { isLoggedIn, email, username, userId } = await isUserLoggedIn();
        if (!isLoggedIn) {
          router.push("/login");
          return;
        }
        
        const { entries: entriesData, profile: profileData } =
          await getData(userId);
        setEntries(entriesData);
        setProfile(profileData);
        setEmail(email);
        setUserName(username);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    handleCheckedLoggedIn();
  }, []);

  if (loading) {
    return <Container size="lg" py="md">Loading...</Container>;
  }

  const handleResetPassword = () => {
    // Redirect to the password reset flow
    router.push("/reset-password");
  };

  return (
    <Container size="lg" py="md">
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
    </Container>
  );
};

export default ProfilePage;
