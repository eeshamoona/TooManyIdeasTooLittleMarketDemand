import { MantineColorScheme } from "@mantine/core";

export const getEntry = async (entry) => {
  console.log("getting Entry content");
  // Convert to JavaScript Date object
  const dateObj = new Date(entry.created_at);

  // Extract the date in YYYY-MM-DD format
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(dateObj.getDate()).padStart(2, "0");

  // Extract the time in HH:MM:SS AM/PM format
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert '0' hour to '12'
  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  // Format the date and time
  const formattedCreatedAt = `${year}-${month}-${day}`;

  // Build the file content
  const content = `
======================
Prompted Entry Download
======================

Date: ${formattedCreatedAt} at ${formattedTime}
Category: ${entry.category || "N/A"}

----------------------
Prompt:
----------------------
${entry.prompt || "N/A"}

----------------------
Response:
----------------------
${entry.text || "N/A"}

----------------------
Statistics:
----------------------
- Total Characters: ${entry.metadata_stats?.totalCharacters || 0}
- AI-Generated Characters: ${entry.metadata_stats?.aiCharacters || 0}
- User-Written Characters: ${entry.metadata_stats?.userCharacters || 0}
- User Percentage: ${entry.metadata_stats?.userPercentage || 0}%
- Unique Words: ${entry.metadata_stats?.uniqueWordCount || 0}
- Unique Word Percentage: ${entry.metadata_stats?.uniqueWordPercentage || 0}%
- Total Words: ${entry.metadata_stats?.totalWords || 0}
- Time Spent Writing: ${entry.metadata_stats?.elapsedTime || 0} seconds
- AI Call Count: ${entry.metadata_stats?.aiCallCount || 0}

----------------------
AI Feedback:
----------------------
${JSON.stringify(entry.ai_feedback, null, 2) || "N/A"}

----------------------
Word Frequency:
----------------------
${
  Object.entries(entry.word_freq || {})
    .map(([word, freq]) => `"${word}": ${freq}`)
    .join("\n") || "N/A"
}
`;

  // Create a downloadable file
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = `prompted-${formattedCreatedAt}-entry_${entry.id}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const getPercentageColor = (
  percentage: number,
  colorScheme?: MantineColorScheme
) => {
  if (colorScheme) {
    if (percentage > 66)
      return colorScheme === "dark"
        ? "var(--mantine-color-green-8)"
        : "var(--mantine-color-green-3)";
    if (percentage > 33)
      return colorScheme === "dark"
        ? "var(--mantine-color-yellow-8)"
        : "var(--mantine-color-yellow-3)";
    return colorScheme === "dark"
      ? "var(--mantine-color-red-7)"
      : "var(--mantine-color-red-3)";
  } else {
    if (percentage > 66) return "var(--mantine-color-green-6)";
    if (percentage > 33) return "var(--mantine-color-yellow-6)";
    return "var(--mantine-color-red-6)";
  }
};
