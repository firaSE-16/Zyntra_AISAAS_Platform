"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Icon, MessageSquare } from "lucide-react";
import React from "react";

const BotAvatar =  () => {


  return <Avatar className="bg-[#e4b2ce59] rounded-full p-3">
    
  <AvatarImage src="" />
  <AvatarFallback >    <MessageSquare/>
  </AvatarFallback>
</Avatar>

};

export default BotAvatar;
