import React from "react";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobilesidebar";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";

interface NavbarProps {
  apiLimitCount: number;
  isPro?: boolean;
}

const Navbar = ({ apiLimitCount, isPro }: NavbarProps) => {
  const { dark, toggleDark } = useTheme();
  return (
    <nav className="w-full flex items-center justify-between px-2 sm:px-6 py-2 sm:py-3 h-16 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-md z-30">
      <div className="flex items-center gap-2">
        <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        <div className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Zyntra Logo" width={32} height={32} className="rounded-xl" />
          <span className="font-extrabold text-xl tracking-tight text-indigo-600 dark:text-pink-400 select-none">Zyntra</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle dark mode"
          className="rounded-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:scale-110 transition"
          onClick={toggleDark}
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
          )}
        </button>
        <UserButton afterSignOutUrl='/'/>
      </div>
    </nav>
  );
};

export default Navbar;
