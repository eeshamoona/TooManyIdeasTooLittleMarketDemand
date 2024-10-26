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
  delay = 30, // faster typing speed
}) => {
  return (
    <Typewriter
      options={{
        strings: strings,
        autoStart: true,
        loop: loop,
        deleteSpeed: 20, // faster delete speed
        delay: delay,
      }}
    />
  );
};
