"use client";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { IconButton } from "@chakra-ui/react";

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton
      aria-label="Go back"
      onClick={() => router.back()}
      icon={<BiArrowBack />}
    />
  );
};

export default BackButton;
