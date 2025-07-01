"use client"
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "./ui/badge";
import { Code, ImageIcon, MessageSquare, Music, Video } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Button } from "./ui/button";

const tools = [
    {
        label:"Conversation",
        icon:MessageSquare,
        color:"text-violet-500",
        bgColor:"bg-violet-500/10",
        href:"/conversation"
    },
    {
        label:"Music Generation",
        icon:Music,
        color:"text-emerald-500",
        bgColor:"bg-emerald-500/10",
        href:"/music"
    },{
        label:"Image Generation",
        icon:ImageIcon,
        color:"text-pink-700",
        bgColor:"bg-pink-700/10",
        href:"/image"
    },{
        label:"Video Generation",
        icon:Video,
        color:"text-orange-700",
        bgColor:"bg-orange-700/10",
        href:"/video"
    },{
        label:"Code Generation",
        icon:Code,
        color:"text-green-700",
        bgColor:"bg-green-700/10",
        href:"/code"
    }
]
const ProModal = () => {
    const proModal = useProModal()
    const [loading, setLoading] = React.useState(false);

    const onSubscribe = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/stripe");
        window.location.href = response.data.url;
      } catch (error) {
        alert("Failed to start subscription. Please try again.");
        console.log(error, "STRIPE_CLIENT_ERROR");
      } finally {
        setLoading(false);
      }
    }

  return <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>
                <div className="flex items-center gap-x-2 font-bold py-1">

                Upgrade to Genius
                <Badge className="uppercase text-sm py-1"/>
            
                </div>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
              Unlock unlimited generations and advanced features with Genius Pro.
            </DialogDescription>
            <div className="space-y-2 pt-2">
              {tools.map((tool) => (
                <Card key={tool.label} className="p-3 border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-3 w-fit rounded-m", tool.bgColor)}>
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <div className="font-semibold text-sm">{tool.label}</div>
                  </div>
                </Card>
              ))}
            </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSubscribe} disabled={loading}>
            {loading ? "Loading..." : "Subscribe"}
          </Button>
        </DialogFooter>
    </DialogContent>
  </Dialog>;
};

export default ProModal;
