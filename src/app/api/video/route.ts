import { NextResponse } from 'next/server';
import axios from 'axios';
import Replicate from "replicate"
import { checktApiLimit, increaseApiLimit } from '@/lib/api-limit';

const REPLICATE_API = process.env.REPLICATE_AI_API_KEY;
const replicate = new Replicate({
    auth: REPLICATE_API
})



export async function POST(req:NextResponse) {
  try {
    if (!REPLICATE_API) {
      console.error("TOPMEDIAI_API_KEY is not configured in environment variables.");
      return new NextResponse("Server configuration error: API Key missing.", { status: 500 });
    }

    const { prompt} = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required for music generation.", { status: 400 });
    }
     const freeTrial = await checktApiLimit()
    
        if(!freeTrial){
          return new NextResponse("Free trial has expired." ,{status:403})
    
        }

    const input = {
  prompt: prompt,
  prompt_optimizer: true
};

    const response = await await replicate.run("minimax/video-01", { input });

return NextResponse.json(response)

    

  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
      await increaseApiLimit()
      const err = error as { response?: { data?: any; status?: number }; message?: string };
      console.error("[MUSIC_GENERATION_ERROR]", err.response?.data || err.message);
      if (err.response?.status === 401) {
        return new NextResponse("Unauthorized: Invalid API Key.", { status: 401 });
      }
      return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
    } else {
      console.error("[MUSIC_GENERATION_ERROR]", error);
      return new NextResponse("Internal Server Error: Unknown error", { status: 500 });
    }
  }
}