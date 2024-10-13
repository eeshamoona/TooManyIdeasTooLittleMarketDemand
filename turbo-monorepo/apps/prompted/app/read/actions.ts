import { MantineColorScheme } from "@mantine/core";

export const getEntry = async (submission) => {
  // Convert to JavaScript Date object
  const dateObj = new Date(submission.created_at);

  // Extract the date in YYYY-MM-DD format
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(dateObj.getDate()).padStart(2, "0");

  // Extract the time in HH:MM:SS format
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0");

  // Format the extracted date and time
  const formattedCreatedAt = `${year}-${month}-${day}`;
  const formattedTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

  const element = document.createElement("a");
  const file = new Blob(
    [
      `Date: ${formattedCreatedAt} at ${formattedTime}\n\nCategory: ${submission.category}\n\nPrompt: ${submission.prompt}\n\nText: ${submission.text}`,
    ],
    { type: "text/plain" },
  );
  element.href = URL.createObjectURL(file);
  element.download = `${formattedCreatedAt}-entry_${submission.id}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const getPercentageColor = (
  percentage: number,
  colorScheme?: MantineColorScheme,
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
