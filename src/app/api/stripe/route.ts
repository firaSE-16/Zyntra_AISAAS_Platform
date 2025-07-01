import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const settingsUrl = absoluteUrl("/settings");

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    console.log("userId", userId, "user", user);
    if (!userId || !user) {
      console.error("Unauthorized access to /api/stripe: userId or user missing");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
    });
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Zyntra Pro",
              description: "Zyntra Pro Subscription",
              images: [
                "https://cdn-icons-png.flaticon.com/512/107/107831.png",
              ],
            },
            unit_amount: 1000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    // Ensure a UserSubscription row exists for this user
    await prismadb.userSubscription.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 