"use client";
import { Center, Loader, Stack, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const Loading: React.FC = () => {
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 60000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Center style={{ height: "100vh" }}>
      <Stack justify="center" align="center">
        <Loader color="blue" size="lg" type="dots" />
        {timeoutReached && (
          <Text c="dimmed" mt="md">
            This seems to be taking too long. Please refresh the page or sign in
            and sign out again.
          </Text>
        )}
      </Stack>
    </Center>
  );
};

export default Loading;
