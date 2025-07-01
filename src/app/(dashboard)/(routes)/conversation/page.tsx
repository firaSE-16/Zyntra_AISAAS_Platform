"use client";

import Heading from "@/components/converation/Heading";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/constant";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import axios from "axios";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loarder";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatart";
import { Progress } from "@/components/ui/progress";

const tips = [
  "Tip: You can ask follow-up questions!",
  "Tip: Use clear, specific prompts for best results.",
  "Tip: Your chat history is private.",
];

function Page(props: any) {
  const { refetchApiLimitCount } = props || {};
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  function cleanAiResponse(text: string) {
    let cleanedText = text.replace(/\*\*/g, '') // Remove bold **
                         .replace(/\*/g, '')  // Remove italics *
                         .replace(/- /g, '')  // Remove bullet points -
                         .replace(/^\d+\.\s*/gm, ''); // Remove numbered list formatting
    cleanedText = cleanedText.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    cleanedText = cleanedText.split('\n').map(part => {
      if (!part.includes('<pre>') && !part.includes('</pre>')) {
        return part.replace(/\n/g, '<br />');
      }
      return part;
    }).join('\n');
    return cleanedText;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setShowProgress(true);
      setLoadingProgress(20);
      const userMessage = {
        role: "user",
        content: values.prompt as string,
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setLoadingProgress(40);
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      setLoadingProgress(80);
      const aiMessage = {
        role: "assistant",
        content: cleanAiResponse(response.data) as string,
      };
      setMessages([...newMessages, aiMessage]);
      setLoadingProgress(100);
      setTimeout(() => setShowProgress(false), 400);
      form.reset();
      if (refetchApiLimitCount) refetchApiLimitCount();
    } catch (error: unknown) {
      setShowProgress(false);
      console.error(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      <Heading
        title="Conversation"
        description="Our most advanced Conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="w-full max-w-2xl mx-auto mt-4 mb-2 px-2 sm:px-4">
        <div className="rounded-lg bg-indigo-50 dark:bg-gray-800/80 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 border border-indigo-100 dark:border-gray-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-500" />
          <span>{tip}</span>
        </div>
      </div>
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col pb-40 relative px-1 sm:px-4">
        {showProgress && (
          <div className="sticky top-0 z-20">
            <Progress value={loadingProgress} className="h-1 bg-violet-200 dark:bg-gray-700" />
          </div>
        )}
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted/60 mt-4 animate-pulse">
            <Loader />
          </div>
        )}
        {messages.length === 0 && !isLoading && (
          <Empty label="No conversation started yet." />
        )}
        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {[...messages].reverse().map((message, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl shadow-md transition-all duration-300 animate-fade-in border border-black/10 dark:border-gray-700/40 ${
                  message.role === "user" 
                    ? "bg-white dark:bg-gray-900" 
                    : "bg-violet-50 dark:bg-gray-800"
                }`}
              >
                {message.role === "user" ? (
                  <div className="flex gap-2 items-start"><UserAvatar/><p className="text-sm flex items-center ">{message.content}</p></div>
                ) : (
                  <div className="flex gap-2 items-start">
                    <BotAvatar/>
                    <div 
                      className="text-sm [&>pre]:bg-gray-800 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-md [&>pre]:overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: message.content || '' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-end z-30 bg-gradient-to-t from-white/90 dark:from-gray-900/90 via-transparent to-transparent py-4 sm:py-6 px-1 sm:px-0">
        <div className="w-full max-w-2xl px-0 sm:px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-2xl shadow-xl border border-indigo-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 w-full p-4 focus-within:shadow-2xl flex gap-2 items-center backdrop-blur-md"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 h-12 lg:h-14 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-transparent text-base"
                        disabled={isLoading}
                        placeholder="Type your message and press Enter..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="h-12 lg:h-14 px-8 text-base font-semibold shadow-md"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Page;