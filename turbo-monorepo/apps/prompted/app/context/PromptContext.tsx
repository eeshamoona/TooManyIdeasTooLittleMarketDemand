// PromptsContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type Prompt = {
  id: string;
  text: string;
  category: string;
};

interface PromptsContextType {
  prompts: Prompt[] | null;
}

const PromptsContext = createContext<PromptsContextType>({
  prompts: null
});

export const PromptsProvider: React.FC<{
  children: React.ReactNode;
  initialPrompts: Prompt[];
}> = ({ children, initialPrompts }) => {
  const [prompts] = useState(initialPrompts); // Use initial prompts passed from server

  return (
    <PromptsContext.Provider value={{ prompts }}>
      {children}
    </PromptsContext.Provider>
  );
};

export const usePrompts = () => {
  const context = useContext(PromptsContext);
  if (context === undefined) {
    throw new Error("usePrompts must be used within a PromptsProvider");
  }
  return context;
};
