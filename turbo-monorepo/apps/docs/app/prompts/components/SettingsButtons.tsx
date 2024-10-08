"use client";
import { useRouter } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { IconButton } from "@chakra-ui/react";

const SettingsButton = () => {
  const router = useRouter();

  return (
    <IconButton
      aria-label="Go to settings"
      onClick={() => router.push("/prompts/settings")}
      icon={<FiSettings />}
    />
  );
};

export default SettingsButton;
