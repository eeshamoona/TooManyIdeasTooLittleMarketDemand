import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const system_instructions =
  "Generate a short sentence fragment that directly builds on the user’s initial text and prompt, helping them move forward in a collaborative way. The fragment should offer just enough to spark creativity and overcome writer’s block, but leave the sentence unfinished so the user can complete it themselves. Focus on maintaining the user’s voice and narrative direction, keeping the continuation open-ended and natural.\n\nReview both the user’s text and the prompt to understand the flow, tone, and style they are aiming for. Craft a sentence starter or fragment that extends their idea logically, leaving room for the user to expand on it without introducing unrelated concepts or resolving the thought entirely. The goal is to offer a clear next step that invites the user to continue the sentence on their own.";

export async function POST(request: Request) {
  const { response, prompt } = await request.json();

  if (!response || !prompt) {
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
              text: `Prompt: ${prompt}\n\nUser's Text: ${response}`,
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      response_format: {
        type: "text",
      },
    });
    const generatedSentence = openaiResponse.choices[0].message.content.trim();
    return NextResponse.json({ generatedSentence }, { status: 200 });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Error generating summary" },
      { status: 500 }
    );
  }
}
