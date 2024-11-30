import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import React, { Suspense } from "react";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { PromptsProvider } from "./context/PromptContext";
import "./globals.css";
import Loading from "./loading";
import { CustomAppShell } from "./shell";
import { createClient } from "./utils/supabase/server";

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

  const { data: prompts, error } = await supabase.from("prompts").select();
  if (error) return <div>{error.message}</div>;
  const user = data?.user ?? null;
  const isLoggedIn = !!user;
  let metadata = isLoggedIn ? user.user_metadata : null;

  return (
    <html lang="en">
      <body>
        <MantineProvider defaultColorScheme="light">
          <Suspense fallback={<Loading />}>
            <PromptsProvider initialPrompts={prompts}>
              <CustomAppShell metadata={metadata} isLoggedIn={isLoggedIn}>
                {children}
              </CustomAppShell>
            </PromptsProvider>
          </Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}
