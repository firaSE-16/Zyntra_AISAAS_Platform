import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

const layout = ({children}:{chilren:React.ReactNode}) => {
  return <div className="h-full relative">
    <div className="hidden h-full md:flex md:fixed md:w-72 md:flex-col md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar/>
    </div>
    
    <main className="md:pl-72">
        <Navbar/>
{children}
    </main>
    </div>;
};

export default layout;
