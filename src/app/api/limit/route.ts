import { NextResponse } from "next/server";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscirption";

export async function GET() {
  const count = await getApiLimitCount();
  const isPro = await checkSubscription();
  return NextResponse.json({ count, isPro });
} 