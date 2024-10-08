import { Heading } from "@chakra-ui/react";
import { createClient } from "../utils/supabase/server";
import Filter from "./components/FilterPrompts";
import SettingsButton from "./components/SettingsButtons";

export default async function Page() {
  const supabase = createClient();

  const { data: prompts } = await supabase.from("prompts").select();

  if (!prompts) return <div>Failed to load prompts</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Heading style={{ flex: 1, textAlign: "center", margin: 0 }}>
          Creative Prompts
        </Heading>
        <SettingsButton />
        <div style={{ width: "40px" }} />
      </div>
      <Filter prompts={prompts} />
    </div>
  );
}
