import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  system_instructions,
  system_instructions_with_profile,
} from "./constants";

//TODO: Determine if I need to batch the text to avoid hitting the token limit

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getSystemInstructions(profile?: {
  feedbackPersona?: string;
  motivatingFeedback?: string;
}) {
  if (!profile || (!profile.feedbackPersona && !profile.motivatingFeedback)) {
    console.log("Using default instructions");
    return system_instructions;
  }

  let instructions = system_instructions_with_profile;

  if (profile.feedbackPersona) {
    instructions = instructions.replace(
      "{{FEEDBACK_PERSONA}}",
      `The user's preferred feedback persona is: ${profile.feedbackPersona}`
    );
  } else {
    instructions = instructions.replace("{{FEEDBACK_PERSONA}}", "");
  }

  if (profile.motivatingFeedback) {
    instructions = instructions.replace(
      "{{MOTIVATING_FEEDBACK}}",
      `The user prefers to receive motivating feedback in the following way: ${profile.motivatingFeedback}`
    );
  } else {
    instructions = instructions.replace("{{MOTIVATING_FEEDBACK}}", "");
  }

  console.log("Using profile instructions", profile);

  return instructions;
}

export async function POST(request: Request) {
  const { response, category, prompt, profile } = await request.json();

  if (!response || !prompt || !category) {
    console.log("Missing required fields:", { response, category, prompt });
    return NextResponse.json(
      { error: "Response and Prompt are required" },
      { status: 400 }
    );
  }

  try {
    const instructions = getSystemInstructions(profile);

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: instructions,
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
