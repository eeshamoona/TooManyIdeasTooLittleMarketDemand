import { Box, Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import "./globals.css";
import Providers from "@repo/ui/providers";
import { createClient } from "./utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  const isLoggedIn = !!user;

  return (
    <html lang="en">
      <body>
        <Providers>
          <Flex direction="column" minH="100vh" w="100vw" bg="lightgrey">
            <Header isLoggedIn={isLoggedIn} />
            <Box as="main" flex="1" p={4}>
              {children}
            </Box>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
