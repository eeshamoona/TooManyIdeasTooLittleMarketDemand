"use client"; // Ensure this component is a client-side component

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button"; // Adjust the import based on your button component

const BackButton = () => {
  const router = useRouter(); // Initialize the router

  return <Button onClick={() => router.back()}>Back</Button>;
};

export default BackButton;
