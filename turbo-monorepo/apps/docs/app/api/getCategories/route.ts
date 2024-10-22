import { NextResponse } from "next/server";
import OpenAI from "openai";
import { system_instructions } from "./constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { data, length } = await request.json();

  if (!data || !Array.isArray(data)) {
    return NextResponse.json(
      { error: "Data must be an array of strings" },
      { status: 400 }
    );
  }

  const content = `Number of Categories: ${length}\nValues: ${JSON.stringify(data)}`;

  try {
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: system_instructions,
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    let categorizedData = openaiResponse.choices[0].message.content.trim();
    console.log("Categorized Data:", categorizedData);
    // Remove JSON beginning and end markers
    if (categorizedData.startsWith("```json")) {
      categorizedData = categorizedData.slice(7);
    }
    if (categorizedData.endsWith("```")) {
      categorizedData = categorizedData.slice(0, -3);
    }
    return NextResponse.json({ categorizedData }, { status: 200 });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Error generating summary" },
      { status: 500 }
    );
  }
}
