"use client"
import axios from "axios";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import React, { useState } from "react";

interface SubscriptionButtonProps {
    isPro:boolean;
}
export const SubscriptionButton = ({isPro=false}:SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false);

    const onClick = async ()=>{
        setLoading(true);
        try{
            const response = await axios.get("/api/stripe")
            window.location.href = response.data.url;

        }
        catch(error){
            console.error("Error while subscribing:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button variant={isPro ? "default" : "premium"} onClick={onClick} disabled={loading}>
            {isPro ? "Manage Subscription":"Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white"/>}
        </Button>
    )
}