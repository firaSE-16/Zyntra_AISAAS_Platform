import { auth } from "@clerk/nextjs/server";
import { checkSubscription } from "@/lib/subscirption";
import {MAX_FREE_COUNTS} from "@/constants"
import prismadb from "./prismadb";

export const increaseApiLimit = async ()=>{
    const { userId } = await auth();
    if(!userId){
        return;
    }
    // Do not increase for Pro users
    const isPro = await checkSubscription();
    if (isPro) return;
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where:{
            userId
        }
    })

    if(userApiLimit){
        await prismadb.userApiLimit.update({
            where:{userId:userId},
            data:{count:userApiLimit.count+1}
        })

    }else{
        await prismadb.userApiLimit.create({
            data:{userId:userId,count:1}
        })
    }
}

export const checktApiLimit = async ()=>{
    const {userId} = await auth()
    if(!userId){
        return false
    }
    // Always allow for Pro users
    const isPro = await checkSubscription();
    if (isPro) return true;
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where:{
            userId:userId
        }
    })

    if(!userApiLimit|| userApiLimit.count < MAX_FREE_COUNTS){
        return true
    }else{
        return false
    }
}

export const getApiLimitCount = async () =>{
    const {userId} = await auth();
    if(!userId){
        return 0
    }
    // Always show 0 for Pro users
    const isPro = await checkSubscription();
    if (isPro) return 0;
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where:{
            userId
        }
    })

    if(!userApiLimit){
        return 0
    }
    return userApiLimit.count
}