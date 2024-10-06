import { createClient } from "../utils/supabase/server";
import Filter from "./components/FilterPrompts";
import SettingsButton from "./components/SettingsButtons";

export default async function Page() {
  const supabase = createClient();

  // Fetch all prompts from Supabase
  const { data: prompts } = await supabase.from("prompts").select();

  if (!prompts) return <div>Failed to load prompts</div>;

  return (
    <div>
      <h1>Journal Prompts</h1>
      <Filter prompts={prompts} />
      <SettingsButton />
    </div>
  );
}
