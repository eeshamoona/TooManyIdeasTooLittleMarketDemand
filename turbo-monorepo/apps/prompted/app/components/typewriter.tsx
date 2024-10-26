"use client";
import React from "react";
import Typewriter from "typewriter-effect";

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
  // Define responsive font sizes
  const responsiveFontSize = {
    fontSize: "1.8rem", // This scales with viewport width
    width: "100%",
    fontWeight: 300,
    minHeight: "5rem",
  };

  return (
    <div style={responsiveFontSize}>
      <Typewriter
        options={{
          strings: strings,
          autoStart: true,
          loop: loop,
          deleteSpeed: 20, // faster delete speed
          delay: delay,
        }}
      />
    </div>
  );
};
