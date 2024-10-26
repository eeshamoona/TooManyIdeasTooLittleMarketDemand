import { NextResponse } from "next/server";
import OpenAI from "openai";
import { system_instructions } from "./constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { category, description, prompts } = await request.json();

  if (!prompts || !description || !category) {
    console.log("Missing required fields:", { category, description, prompts });
    return NextResponse.json(
      { error: "Response and Prompt are required" },
      { status: 400 },
    );
  }

  try {
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: system_instructions,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `# Category Title: ${category}\n# Category Description: ${description}\n\n# Example Prompts: ${prompts}`,
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "json_object",
      },
    });

    // console.log("Received response from OpenAI API:", openaiResponse);

    // const aiSuggestions = openaiResponse.choices[0].message.content.trim();
    // const aiSuggestionsArray = JSON.parse(aiSuggestions);

    // if (
    //   Array.isArray(aiSuggestionsArray) &&
    //   aiSuggestionsArray.every((item) => typeof item === "string")
    // ) {
    //   console.log("Generated array of strings:", aiSuggestionsArray);
    //   return NextResponse.json(
    //     { aiFeedback: aiSuggestionsArray },
    //     { status: 200 }
    //   );
    // } else {
    //   console.error("Invalid response format: Expected an array of strings");
    //   return NextResponse.json(
    //     { error: "Invalid response format: Expected an array of strings" },
    //     { status: 500 }
    //   );
    // }

    const aiSuggestionsArray = openaiResponse.choices[0].message.content.trim();

    return NextResponse.json({ aiSuggestionsArray }, { status: 200 });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Error generating summary" },
      { status: 500 },
    );
  }
}
