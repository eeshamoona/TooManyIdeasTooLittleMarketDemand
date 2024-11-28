import { NextResponse } from "next/server";
import OpenAI from "openai";
import { system_instructions } from "./constants";

//TODO: Determine if I need to batch the text to avoid hitting the token limit

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { response, category, prompt } = await request.json();

  if (!response || !prompt || !category) {
    console.log("Missing required fields:", { response, category, prompt });
    return NextResponse.json(
      { error: "Response and Prompt are required" },
      { status: 400 }
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
              text: `# Prompt: ${prompt}\n# Category: ${category}\n\n# User's Text: ${response}`,
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

    const aiFeedback = openaiResponse.choices[0].message.content.trim();

    return NextResponse.json({ aiFeedback }, { status: 200 });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Error generating summary" },
      { status: 500 }
    );
  }
}
