import React, { Suspense } from "react";
import "./globals.css";
import { createClient } from "./utils/supabase/server";
import { CustomAppShell } from "./shell";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/carousel/styles.css";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import Loading from "./loading";
import { MantineProvider } from "@mantine/core";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  // const { data: prompts, error } = await supabase.from("prompts").select();
  // write prompts to react context so that it is loaded for the enteire app
  // const prompts = await supabase.from("prompts").select();
  // console.log("prompts:", prompts);

  // if (error) return <div>{error.message}</div>;
  const user = data?.user ?? null;
  const isLoggedIn = !!user;
  let metadata = isLoggedIn ? user.user_metadata : null;

  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme="light">
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
