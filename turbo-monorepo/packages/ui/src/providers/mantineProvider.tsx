"use client";
import { MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <MantineProvider>{children}</MantineProvider>;
}
