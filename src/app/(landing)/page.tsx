"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MessageSquare, ImageIcon, Code, Music, Video, Zap } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

const featureCards = [
  {
    icon: <MessageSquare className="w-10 h-10 mb-2 text-violet-500" />,
    badge: "Text",
    title: "AI Conversations",
    desc: "Chat with advanced AI for brainstorming, support, and more.",
  },
  {
    icon: <ImageIcon className="w-10 h-10 mb-2 text-pink-600" />,
    badge: "Image",
    title: "Image Generation",
    desc: "Create stunning visuals and artwork with a single prompt.",
  },
  {
    icon: <Code className="w-10 h-10 mb-2 text-green-600" />,
    badge: "Code",
    title: "Code Assistant",
    desc: "Generate, review, and fix code in multiple languages instantly.",
  },
  {
    icon: <Music className="w-10 h-10 mb-2 text-emerald-500" />,
    badge: "Music",
    title: "Music Creation",
    desc: "Compose unique music tracks for your projects or fun.",
  },
  {
    icon: <Video className="w-10 h-10 mb-2 text-orange-500" />,
    badge: "Video",
    title: "Video Generation",
    desc: "Produce creative videos from text or image prompts.",
  },
  {
    icon: <Zap className="w-10 h-10 mb-2 text-yellow-400" />,
    badge: "Pro",
    title: "Unlimited Access",
    desc: "Upgrade to Pro for unlimited generations and premium support.",
  },
];

export default function Home() {
  const { dark, toggleDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden ${dark ? "dark bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800" : "bg-gradient-to-br from-indigo-50 via-white to-pink-50"}`}>
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-400 via-pink-300 to-violet-400 blur-3xl opacity-60 dark:from-pink-900 dark:via-indigo-900 dark:to-violet-900 z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.8 }}
        className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-200 via-indigo-200 to-violet-200 blur-2xl opacity-60 dark:from-indigo-900 dark:via-pink-900 dark:to-violet-900 z-0"
      />
      {/* Navigation Bar */}
      <nav className={`w-full px-4 py-4 flex items-center justify-between max-w-6xl mx-auto ${dark ? "bg-gray-950/80" : "bg-white/80"} rounded-b-2xl shadow-md z-10 relative`}> 
        <div className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Zyntra Logo" width={40} height={40} className="rounded-xl" />
          <span className="font-extrabold text-2xl tracking-tight text-indigo-600 dark:text-pink-400">Zyntra</span>
        </div>
        <div className="hidden md:flex gap-8 text-lg font-medium">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-pink-400 transition dark:text-white text-gray-900">Home</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-pink-400 transition dark:text-white text-gray-900">About</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-pink-400 transition dark:text-white text-gray-900">Features</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-pink-400 transition dark:text-white text-gray-900">Pricing</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-pink-400 transition dark:text-white text-gray-900">Contact</a>
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
          <Link href="/sign-in">
            <Button size="sm" variant="outline" className="hidden md:inline-block dark:text-white text-gray-900 border-gray-300 dark:border-gray-700">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-16 pb-12 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image src="/assets/logo.png" alt="Zyntra Logo" width={80} height={80} className="mb-4 rounded-2xl shadow-lg" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight relative"
        >
          Unlock AI Power with <span className="text-indigo-600 dark:text-pink-400 relative z-10">Zyntra</span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="block h-2 w-32 bg-gradient-to-r from-indigo-400 via-pink-400 to-violet-400 rounded-full absolute left-1/2 -translate-x-1/2 bottom-[-10px] origin-left opacity-60"
          />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
        >
          The all-in-one AI SaaS platform for text, image, code, music, and video generation. <br />
          <span className="text-indigo-500 dark:text-pink-400 font-semibold">Free trial</span> &mdash; <span className="text-pink-500 dark:text-indigo-400 font-semibold">Upgrade anytime</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/sign-up">
            <Button size="lg" className="text-lg px-8 py-5 shadow-xl animate-bounce-slow">Get Started Free</Button>
          </Link>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {featureCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.7 }}
          >
            <Card className="p-6 flex flex-col items-center text-center shadow-md hover:shadow-2xl transition dark:bg-gray-900 dark:border-gray-800 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition bg-gradient-to-br from-indigo-400 via-pink-400 to-violet-400 blur-2xl z-0" />
              <div className="z-10 relative">
                {card.icon}
                <Badge variant="premium" className="mb-3">{card.badge}</Badge>
                <h3 className="font-bold text-xl mb-2 dark:text-white">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-300">{card.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Pricing Section */}
      <section className="w-full max-w-3xl mx-auto px-4 py-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-3xl font-bold mb-4 dark:text-white"
        >
          Simple Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          Start for free. Upgrade anytime for unlimited access.
        </motion.p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex-1"
          >
            <Card className="p-8 shadow-lg border-2 border-indigo-100 dark:bg-gray-900 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-2 dark:text-white">Free</h3>
              <p className="text-4xl font-extrabold mb-2 dark:text-white">$0</p>
              <ul className="text-gray-500 dark:text-gray-300 mb-4 space-y-1">
                <li>5 generations per feature</li>
                <li>Access to all tools</li>
                <li>Email support</li>
              </ul>
              <Link href="/sign-up">
                <Button className="w-full">Start Free</Button>
              </Link>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.22, duration: 0.7 }}
            className="flex-1"
          >
            <Card className="p-8 shadow-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-indigo-50 dark:bg-gray-900 dark:border-pink-400">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2 dark:text-white">Pro <Badge variant="premium">Best Value</Badge></h3>
              <p className="text-4xl font-extrabold mb-2 dark:text-white">$10 <span className="text-lg font-medium text-gray-500 dark:text-gray-300">/mo</span></p>
              <ul className="text-gray-500 dark:text-gray-300 mb-4 space-y-1">
                <li>Unlimited generations</li>
                <li>Priority support</li>
                <li>Early access to new features</li>
              </ul>
              <Link href="/sign-up">
                <Button variant="premium" className="w-full">Go Pro</Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-400 dark:text-gray-500 text-sm border-t bg-white/80 dark:bg-gray-900 mt-auto z-10 relative">
        &copy; {new Date().getFullYear()} Zyntra. All rights reserved.
      </footer>
      <style jsx global>{`
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
