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

const Page = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  function cleanAiResponse(text: string) {
    // Remove markdown formatting
    let cleanedText = text.replace(/\*\*/g, '') // Remove bold **
                         .replace(/\*/g, '')  // Remove italics *
                         .replace(/- /g, '')  // Remove bullet points -
                         .replace(/^\d+\.\s*/gm, ''); // Remove numbered list formatting
    
    // Add line breaks for better readability
    cleanedText = cleanedText.replace(/(\n)/g, '<br />');
    
    return cleanedText;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      const aiMessage: ChatCompletionMessageParam = {
        role: "assistant",
        content: cleanAiResponse(response.data),
      };

      setMessages((current) => [...current, aiMessage]);
      
      form.reset();
    } catch (error: unknown) {
      console.error(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced Conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        {messages.length>0?(<div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === "user" 
                    ? "bg-white border border-black/10" 
                    : "bg-muted"
                }`}
                dangerouslySetInnerHTML={{ __html: message.content || '' }}
              />
            ))}
          </div>
        </div>):<div className="flex justify-center items-center h-full">
            <p>No converation stated yet.</p>
            
            </div>


        }
      </div>
    </div>
  );
};

export default Page;