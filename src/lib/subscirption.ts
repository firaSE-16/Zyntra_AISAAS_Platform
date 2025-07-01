import { auth } from "@clerk/nextjs/server";
import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async()=>{
    const { userId } = await auth();

    if(!userId){
        return false;
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
        where:{
            userId: userId
        },
        select:{
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd:true,
            stripeCustomerId:true,
            stripePriceId:true
        }
    })

    if(!userSubscription){
        return false;
    }

    const periodEnd = userSubscription.stripeCurrentPeriodEnd?.getTime?.() ?? 0;
    const isValid = userSubscription.stripePriceId && (periodEnd + DAY_IN_MS > Date.now());

    return isValid;
}

