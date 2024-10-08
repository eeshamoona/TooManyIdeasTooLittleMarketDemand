import { createClient } from "../../utils/supabase/server";
import AddPromptForm from "../components/AddPromptForm";
import PromptList from "../components/PromptList";
import BackButton from "../components/BackButton"; // Import the BackButton component
import { Heading } from "@chakra-ui/react";

export default async function Page() {
  const supabase = createClient();

  const { data: prompts } = await supabase.from("prompts").select();

  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <BackButton />
        <Heading style={{ flex: 1, textAlign: "center", margin: 0 }}>
          Prompt Loader
        </Heading>
        <div style={{ width: "40px" }} />
      </header>
      <div>
        <AddPromptForm />
        <PromptList prompts={prompts || []} />
      </div>
    </div>
  );
}
