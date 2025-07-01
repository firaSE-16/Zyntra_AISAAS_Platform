import { checktApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.ROUTER_AI_API_KEY, // ✅ Make sure the name matches
  defaultHeaders: {
    "HTTP-Referer": "https://yourdomain.com", // ✅ Replace with your real site
    "X-Title": "YourAppName",                // ✅ Replace with your real app name
  },
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.ROUTER_AI_API_KEY) {
      console.error("ROUTER_AI_API_KEY is not configured.");
      return new NextResponse("OpenRouter API Key not configured.", { status: 500 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages are required and must be a non-empty array.", { status: 400 });
    }

     const freeTrial = await checktApiLimit()
    
        if(!freeTrial){
          return new NextResponse("Free trial has expired." ,{status:403})
    
        }

    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-12b-it:free", // ✅ Typo fixed from "googl"
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate code or fix the code if there is an error.",
            },
          ],
        },
        ...messages,
      ],
    });

    const content = completion.choices?.[0]?.message?.content;

    if (content) {
      return NextResponse.json(content);
      await increaseApiLimit();
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
