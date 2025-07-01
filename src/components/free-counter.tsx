"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCounterProps{
    apiLimitCount:number;
    isPro?:boolean;}
const FreeCounter = ({
    apiLimitCount=0,
    isPro=false,
}:FreeCounterProps) => {
    const proModal = useProModal()
    const [mounted,setMounted]=useState(false)
    useEffect(()=>{
        setMounted(true)
    },[])

    
    useEffect(() => {
        if (mounted && apiLimitCount >= MAX_FREE_COUNTS && !proModal.isOpen) {
            proModal.onOpen();
        }
    }, [mounted, apiLimitCount, proModal.isOpen, proModal]);

    // Calculate progress and color
    const progress = (apiLimitCount / MAX_FREE_COUNTS) * 100;
    let progressColor = "bg-green-500";
    if (progress >= 75) {
        progressColor = "bg-red-500";
    } else if (progress >= 50) {
        progressColor = "bg-yellow-400";
    }

    if(!mounted || isPro){
        return null;
    }


  return <div>
    <Card className="bg-white/10 border-0">
    <CardContent className="py-6">
        <div className="text-center text-sm text-white mb-4">
            <p>
                {apiLimitCount}/{MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
                className={`h-3 transition-all duration-500 ${progressColor}`}
                value={progress}
            />
            {apiLimitCount >= MAX_FREE_COUNTS && (
                <div className="text-xs text-red-400 mt-2">You have reached your free limit. Upgrade to continue.</div>
            )}
        </div>
        <Button variant="premium" onClick={()=>proModal.onOpen()} className="w-full" disabled={apiLimitCount >= MAX_FREE_COUNTS && proModal.isOpen}>
            Upgrade<Zap className="w-4 h-4 ml-2 fill-white"/>
        </Button>

    </CardContent>
    </Card>


  </div>;
};

export default FreeCounter;
