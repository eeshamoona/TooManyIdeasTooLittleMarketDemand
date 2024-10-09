import TrackedTextarea from "./TrackedTextarea";

export default function PromptDisplay({ prompt }) {
  const generateAIResponse = async (
    currentResponse: string
  ): Promise<string> => {
    try {
      const generateResponse = await fetch("/api/addASentence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          response: currentResponse,
          prompt: prompt.text,
        }),
      });
      const data = await generateResponse.json();
      return data.generatedSentence || ""; 
    } catch (error) {
      console.error("Error calling API:", error);
      return ""; // Return empty string in case of error
    }
  };

  return (
    <TrackedTextarea
      generate={generateAIResponse} // Injecting the generate function
      promptText={prompt.text}
    />
  );
}
