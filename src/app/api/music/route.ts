import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import Replicate from "replicate"
import { checktApiLimit, increaseApiLimit } from '@/lib/api-limit';

const REPLICATE_API = process.env.REPLICATE_AI_API_KEY;
const replicate = new Replicate({
    auth: REPLICATE_API
})



export async function POST(req: NextRequest) {
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

    const response = await replicate.run(
  "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
  {
    input: {
      alpha: 0.5,
      prompt_a:prompt,
      prompt_b: "90's rap",
      denoising: 0.75,
      seed_image_id: "vibes",
      num_inference_steps: 50
    }
  }
);

return NextResponse.json(response)

    

  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
      await increaseApiLimit()
      const err = error as { response?: { data?: any; status?: number }; message?: string };
      console.error("[VIDEO_GENERATION_ERROR]", err.response?.data || err.message);
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