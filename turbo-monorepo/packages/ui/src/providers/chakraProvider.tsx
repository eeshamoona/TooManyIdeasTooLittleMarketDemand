"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Providers({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ChakraProvider>{children}</ChakraProvider>;
}
