"use client"
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const UserAvatar =  () => {
  const {user} = useUser()

  return <Avatar className="bg-[#e3c5ef59] rounded-full w-10 h-10 ">
    
  <AvatarImage className="rounded-full w-full" src={user?.imageUrl} />
  <AvatarFallback>
    {user?.firstName ? user.firstName[0] : ""}
  </AvatarFallback>
</Avatar>

};

export default UserAvatar;
