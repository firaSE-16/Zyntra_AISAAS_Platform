"use client";

import Heading from "@/components/converation/Heading";
import { Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/constant";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loarder";
import UserAvatar from "@/components/user-avatar";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

const tips = [
  "Tip: Describe the style, subject, and colors for best results!",
  "Tip: Image generation may take up to a minute.",
  "Tip: Generated images are private to you.",
];

const Page = () => {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setShowProgress(true);
      setLoadingProgress(20);
      setUserPrompt(values.prompt);
      setImages([]);
      setError(null);
      const response = await axios.post("/api/image", {
        prompt: values.prompt
      });
      setLoadingProgress(80);
      if (response.data && response.data.output) {
        setImages(response.data.output);
      } else {
        throw new Error("Unexpected response format from API");
      }
      setLoadingProgress(100);
      setTimeout(() => setShowProgress(false), 400);
      form.reset();
    } catch (error: any) {
      setShowProgress(false);
      console.error("Image generation error:", error);
      setError(error.response?.data?.message || "Image generation failed");
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      <Heading
        title="Image Generation"
        description="Generate images based on your descriptive text."
        icon={ImageIcon}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="w-full max-w-2xl mx-auto mt-4 mb-2 px-2 sm:px-4">
        <div className="rounded-lg bg-violet-50 dark:bg-gray-800/80 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 border border-violet-100 dark:border-gray-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-violet-500" />
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
            <p className="ml-4 text-sm text-gray-500">
              Generating image (may take 20-40 seconds)...
            </p>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-lg bg-red-100 text-red-700 mb-4">
            {error}
          </div>
        )}
        {!isLoading && images.length === 0 && !error && (
          <Empty label="No images generated yet. Enter a prompt to start." />
        )}
        {userPrompt && (
          <div className="p-4 rounded-lg bg-white border border-black/10 mb-4 dark:bg-gray-900 dark:border-gray-700 animate-fade-in">
            <div className="flex gap-2 items-start">
              <UserAvatar />
              <p className="text-sm">{userPrompt}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {images.map((image, index) => (
            <Card key={index} className="rounded-xl overflow-hidden shadow-md border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 animate-fade-in">
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                {image.image_url ? (
                  <Image
                    alt={`Generated image: ${userPrompt}`}
                    src={image.image_url}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-4">
                    <p className="text-sm text-gray-500">
                      Image not available
                    </p>
                  </div>
                )}
              </div>
              <CardFooter className="p-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {image.width}x{image.height}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!image.image_url}
                  onClick={() => image.image_url && window.open(image.image_url, "_blank")}
                >
                  View Full Size
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-end z-30 bg-gradient-to-t from-white/90 dark:from-gray-900/90 via-transparent to-transparent py-4 sm:py-6 px-1 sm:px-0">
        <div className="w-full max-w-2xl px-0 sm:px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-2xl shadow-xl border border-violet-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 w-full p-4 focus-within:shadow-2xl flex gap-2 items-center backdrop-blur-md"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 h-12 lg:h-14 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-transparent text-base"
                        disabled={isLoading}
                        placeholder="Describe an image (e.g., A classroom of robots with 'AI Is Your Friend' on chalkboard)..."
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
};

export default Page;