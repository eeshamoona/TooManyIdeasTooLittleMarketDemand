"use client"; // Ensure this component is a client-side component

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";

const SettingsButton = () => {
  const router = useRouter(); // Initialize the router

  return (
    <Button onClick={() => router.push("/prompts/settings")}>Settings</Button>
  );
};

export default SettingsButton;
