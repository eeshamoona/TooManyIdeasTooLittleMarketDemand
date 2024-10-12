import "./globals.css";
import Providers from "@repo/ui/mantineProvider";
import { createClient } from "./utils/supabase/server";
import { CustomAppShell } from "./shell";
import "@mantine/core/styles.css";

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
        <Providers>
          <CustomAppShell metadata={metadata} isLoggedIn={isLoggedIn}>
            {children}
          </CustomAppShell>
        </Providers>
      </body>
    </html>
  );
}
