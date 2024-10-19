import React, { Suspense } from "react";
import "./globals.css";
import { createClient } from "./utils/supabase/server";
import { CustomAppShell } from "./shell";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import Loading from "./loading";
import { MantineProvider } from "@mantine/core";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  const isLoggedIn = !!user;
  let metadata = isLoggedIn ? user.user_metadata : null;

  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <Suspense fallback={<Loading />}>
            <CustomAppShell metadata={metadata} isLoggedIn={isLoggedIn}>
              {children}
            </CustomAppShell>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}
