"use client";

import Heading from "@/components/converation/Heading";
import { Video } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const tips = [
  "Tip: Describe the scene, style, or action for best results!",
  "Tip: Video generation may take up to a minute.",
  "Tip: Generated videos are private to you.",
];

const Page = () => {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string>();
  const [openDialog, setOpenDialog] = useState(false);
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
      setVideoUrl(undefined);
      const response = await axios.post("/api/music", values);
      setLoadingProgress(80);
      setVideoUrl(response.data.output);
      setOpenDialog(true);
      setLoadingProgress(100);
      setTimeout(() => setShowProgress(false), 400);
      form.reset();
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
        title="Video Generation"
        description="Turn your prompt into video."
        icon={Video}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      />
      <div className="w-full max-w-2xl mx-auto mt-4 mb-2 px-2 sm:px-4">
        <div className="rounded-lg bg-orange-50 dark:bg-gray-800/80 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 border border-orange-100 dark:border-gray-700 flex items-center gap-2">
          <Video className="w-4 h-4 text-orange-500" />
          <span>{tip}</span>
        </div>
      </div>
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col pb-40 relative px-1 sm:px-4">
        {showProgress && (
          <div className="sticky top-0 z-20">
            <Progress value={loadingProgress} className="h-1 bg-orange-200 dark:bg-gray-700" />
          </div>
        )}
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted/60 mt-4 animate-pulse">
            <Loader />
          </div>
        )}
        {!videoUrl && !isLoading && (
          <Empty label="No video generated yet." />
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[625px] animate-fade-in">
          <DialogHeader>
            <DialogTitle>Generated Video</DialogTitle>
          </DialogHeader>
          {videoUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <video 
                controls 
                className="w-full h-full"
                autoPlay
                loop
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-center">
              Your generated video is ready! The AI has created this based on your prompt.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <div className="fixed bottom-0 left-0 w-full flex justify-center items-end z-30 bg-gradient-to-t from-white/90 dark:from-gray-900/90 via-transparent to-transparent py-4 sm:py-6 px-1 sm:px-0">
        <div className="w-full max-w-2xl px-0 sm:px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-2xl shadow-xl border border-orange-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 w-full p-4 focus-within:shadow-2xl flex gap-2 items-center backdrop-blur-md"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 h-12 lg:h-14 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-transparent text-base"
                        disabled={isLoading}
                        placeholder="Describe the video you want to generate..."
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