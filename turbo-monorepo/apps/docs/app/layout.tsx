import { Box, Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import "./globals.css";
import Providers from "@repo/ui/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Flex direction="column" minH="100vh" w="100vw" bg="lightgrey">
            <Header />
            <Box as="main" flex="1" p={4}>
              {children}
            </Box>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
