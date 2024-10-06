"use client";

import { ReactNode } from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <ChakraButton
      variant={"outline"}
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </ChakraButton>
  );
};
