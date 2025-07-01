import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req:Request){
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string
    let event:Stripe.Event;
    try{
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("STRIPE_WEBHOOK_SECRET is not defined in environment variables.");
        }
        event = stripe.webhooks.constructEvent(
            body, 
            signature, 
            webhookSecret)
    }
    catch(error){
        console.error("Error parsing webhook body:", error);
        return new Response("Webhook Error", { status: 400 });
    }

    console.log("[WEBHOOK] Event type:", event.type);
    if(event.type === "checkout.session.completed"){
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session?.metadata?.userId;
        const subscriptionId = session.subscription as string;
        if (!userId || !subscriptionId) {
            console.error("[WEBHOOK] Missing userId or subscriptionId", { userId, subscriptionId });
            return new NextResponse("Missing userId or subscriptionId", { status: 400 });
        }
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
        // Fallback for period end
        const periodEnd = (subscription as any).current_period_end || (subscription as any).trial_end || (subscription as any).start_date;
        if (!subscription.id || !subscription.customer || !subscription.items.data[0]?.price?.id || !periodEnd) {
            console.error("[WEBHOOK] Missing subscription fields:", {
                id: subscription.id,
                customer: subscription.customer,
                priceId: subscription.items.data[0]?.price?.id,
                periodEnd,
                full: subscription
            });
            return new NextResponse("Missing subscription fields", { status: 400 });
        }
        try {
            const result = await prismadb.userSubscription.updateMany({
                where: { userId },
                data: {
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(periodEnd * 1000)
                }
            });
            console.log("[WEBHOOK] updateMany result:", result);
        } catch (err) {
            console.error("[WEBHOOK] updateMany error:", err);
        }
    }
    if(event.type === "invoice.payment_succeeded"){
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : undefined;
        if (!subscriptionId) {
            console.error("[WEBHOOK] invoice.payment_succeeded missing subscriptionId", { subscriptionId });
            return new NextResponse("Missing subscriptionId", { status: 400 });
        }
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
        const periodEnd = (subscription as any).current_period_end || (subscription as any).trial_end || (subscription as any).start_date;
        if (!subscription.id || !subscription.items.data[0]?.price?.id || !periodEnd) {
            console.error("[WEBHOOK] Missing subscription fields for payment_succeeded:", {
                id: subscription.id,
                priceId: subscription.items.data[0]?.price?.id,
                periodEnd,
                full: subscription
            });
            return new NextResponse("Missing subscription fields", { status: 400 });
        }
        try {
            const result = await prismadb.userSubscription.updateMany({
                where: {
                    stripeSubscriptionId: subscription.id
                }, data: {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(periodEnd * 1000)
                }
            });
            console.log("[WEBHOOK] Payment succeeded updateMany result:", result);
        } catch (err) {
            console.error("[WEBHOOK] Payment succeeded updateMany error:", err);
        }
    }
    if(event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated"){
        const subscription = event.data.object as Stripe.Subscription;
        const periodEnd = (subscription as any).current_period_end || (subscription as any).trial_end || (subscription as any).start_date;
        if (!periodEnd) {
            console.error("[WEBHOOK] customer.subscription.updated/deleted missing periodEnd", { full: subscription });
            return new NextResponse("Missing periodEnd", { status: 400 });
        }
        try {
            const result = await prismadb.userSubscription.updateMany({
                where: {
                    stripeSubscriptionId: subscription.id
                },
                data: {
                    stripeCurrentPeriodEnd: (subscription.cancel_at_period_end || subscription.status === "canceled")
                        ? new Date(0) // expired
                        : new Date(periodEnd * 1000)
                }
            });
            console.log("[WEBHOOK] Subscription deleted/updated updateMany result:", result);
        } catch (err) {
            console.error("[WEBHOOK] Subscription deleted/updated updateMany error:", err);
        }
    }

    return new NextResponse(null,{status:200})
}