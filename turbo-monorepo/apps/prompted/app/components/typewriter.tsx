"use client";
import React from "react";
import Typewriter from "typewriter-effect";

// Props for flexibility in string input and loop control
interface TypewriterArrayProps {
  strings: string[];
  loop?: boolean;
  delay?: number;
}

export const TypewriterArray: React.FC<TypewriterArrayProps> = ({
  strings,
  loop = true,
  delay = 50,
}) => {
  return (
    <Typewriter
      options={{
        strings: strings,
        autoStart: true,
        loop: loop,
        deleteSpeed: 30,
        delay: delay,
      }}
    />
  );
};
