import { checktApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscirption";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
         const freeTrial = await checktApiLimit()
        
            if(!freeTrial){
              return new NextResponse("Free trial has expired." ,{status:403})
        
            }

        const apiUrl = "https://api.aimlapi.com/v1/images/generations";
        const apiKey = "83f2fead7abc4857bfb3cfd1050296b1";
        
        const payload = {
            "model": "flux/dev",
            "image_size": "landscape_4_3",
            "guidance_scale": 7.5, // Increased for better quality
            "num_inference_steps": 30, // Increased for better quality
            "enable_safety_checker": true,
            "prompt": prompt,
            "num_images": 1,
            "seed": Math.floor(Math.random() * 1000000) // Random seed
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const isPro = await checkSubscription();
            if (!isPro) {
                await increaseApiLimit();
            }
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("[IMAGE_GENERATION_ERROR]", error);
        return new NextResponse(error.message || "Image generation failed", { 
            status: 500 
        });
    }
}