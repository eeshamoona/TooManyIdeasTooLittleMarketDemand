import { createClient } from "../../utils/supabase/server";
import AddPromptForm from "../components/AddPromptForm";
import PromptList from "../components/PromptList";
import BackButton from "../components/BackButton"; // Import the BackButton component

export default async function Page() {
  const supabase = createClient();

  const { data: prompts } = await supabase.from("prompts").select();

  return (
    <div>
      <h1>Journal Prompts</h1>
      <div>
        <BackButton />
        <AddPromptForm />
        <PromptList prompts={prompts || []} />
      </div>
    </div>
  );
}
