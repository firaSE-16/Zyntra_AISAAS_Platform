// src/app/api/conversation/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.ROUTER_AI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://your-app-domain.com",
    "X-Title": "My Awesome SaaS App",
  },
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.ROUTER_AI_API_KEY) {
      console.error("ROUTER_AI_API_KEY is not configured.");
      return new NextResponse("OpenRouter API Key not configured.", { status: 500 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages are required and must be a non-empty array.", { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-8b-instruct:free",
      messages: messages,
    });

    if (completion.choices?.[0]?.message?.content) {
      // Return just the content string instead of the whole message object
      return NextResponse.json(completion.choices[0].message.content);
    } else {
      console.error("AI response did not contain valid content.", completion);
      return new NextResponse("AI did not return valid content.", { status: 500 });
    }

  } catch (error) {
    console.error("[CONVERSATION_ERROR]", error);
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("An unknown internal server error occurred.", { status: 500 });
  }
}