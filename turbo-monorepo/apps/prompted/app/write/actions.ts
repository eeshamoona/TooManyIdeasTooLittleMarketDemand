import { TitleOrder } from "@mantine/core";
import { Character } from "./components/tracked-textarea";

export const convertTimeToDescription = (elapsedTime: number) => {
  // Convert elapsed time to a descriptive format
  let descriptiveTime: string;
  if (elapsedTime >= 60) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);
    descriptiveTime = `${minutes} minute${minutes !== 1 ? "s" : ""} and ${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else {
    descriptiveTime = `${Math.floor(elapsedTime)} second${elapsedTime !== 1 ? "s" : ""}`;
  }
  return descriptiveTime;
};

export function getTitleOrder(promptTextLength: number): TitleOrder {
  if (promptTextLength > 90) {
    return 5;
  } else if (promptTextLength > 60) {
    return 4;
  } else if (promptTextLength > 30) {
    return 3;
  } else {
    return 2;
  }
}

export const generateCharacterStats = (characters: Character[], combinedResponse: string, targetWordCount?: number) => {
  const totalCharacters = characters.length;
  const aiCharacters = characters.filter((char) => char.type === "AI").length;
  const userCharacters = characters.filter((char) => char.type === "user").length;

  const userPercentage = totalCharacters > 0 ? (userCharacters / totalCharacters) * 100 : 0;

  const totalWords = combinedResponse.trim().split(/\s+/).length;
  const aiWordCount = combinedResponse
    .split(/\s+/)
    .filter((_, index, array) => {
      const startIndex = array.slice(0, index + 1).join(" ").length - array[index].length;
      return characters[startIndex]?.type === "AI";
    }).length;

  return {
    totalCharacters,
    aiCharacters,
    userCharacters,
    userPercentage: parseFloat(userPercentage.toFixed(2)),
    totalWords,
    targetWordCount: targetWordCount ?? null,
    aiWordCount,
  };
};

export const wordFrequencyMap = (text: string) => {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, "");
  const words = cleanText.split(/\s+/).filter((word) => word !== "");

  const wordFreq: { [word: string]: number } = {};
  words.forEach((word) => (wordFreq[word] = (wordFreq[word] || 0) + 1));

  const sortedWordFreq = Object.entries(wordFreq).sort(([, a], [, b]) => b - a);
  const top10Words = sortedWordFreq.slice(0, 10);

  return { sortedWordFreqDict: Object.fromEntries(sortedWordFreq), top10Words };
};
