"use client"
import { ModalProvider } from "@/components/modal-provider";
import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import { useProModal } from "@/hooks/use-pro-modal";
import React, { useState, useEffect } from "react";

const Layout = ({children}:{children:React.ReactNode}) => {
  const [apiLimitCount, setApiLimitCount] = useState<number | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const promod = useProModal();

  const refetchApiLimit = () => {
    fetch("/api/limit")
      .then(res => res.json())
      .then(data => {
        setApiLimitCount(data.count);
        setIsPro(!!data.isPro);
      });
  };

  useEffect(() => {
    refetchApiLimit();
    const interval = setInterval(refetchApiLimit, 2000);
    return () => clearInterval(interval);
  }, []);

  return <div className="h-full relative">
    <div className="hidden h-full md:flex md:fixed md:w-72 md:flex-col md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar apiLimitCount={apiLimitCount ?? 0} isPro={isPro} />
    </div>
    
    <main className="md:pl-72">
        <Navbar apiLimitCount={apiLimitCount ?? 0} isPro={isPro} />
        {children}
    </main>
    </div>;
};

export default Layout;
