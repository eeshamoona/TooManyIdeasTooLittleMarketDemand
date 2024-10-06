"use client";

import { ReactNode } from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <ChakraButton variant={"outline"} className={className} onClick={onClick}>
      {children}
    </ChakraButton>
  );
};
