"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { handleVideoGeneration } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  error: null,
  video: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full bg-accent hover:bg-accent/90 md:w-auto font-bold tracking-wide">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Video
        </>
      )}
    </Button>
  );
}

function VideoDisplay({ videoSrc }: { videoSrc: string | null }) {
    const { pending } = useFormStatus();

    if (!pending && !videoSrc) {
        return null;
    }

    return (
        <Card className="mt-8 shadow-lg overflow-hidden">
            <CardContent className="p-4 sm:p-6">
                {pending ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8 aspect-video">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="font-headline text-xl text-foreground text-center">
                            Your video is being created...
                        </p>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                            This can take a moment. The result will appear here once ready.
                        </p>
                    </div>
                ) : videoSrc && (
                    <div className="aspect-video w-full rounded-lg bg-black">
                        <video
                            key={videoSrc}
                            src={videoSrc}
                            controls
                            autoPlay
                            loop
                            className="h-full w-full object-contain"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function VideoGenerator() {
  const [state, formAction] = useActionState(handleVideoGeneration, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: state.error,
      });
      setVideoSrc(null);
    }
    if (state.video) {
      setVideoSrc(state.video);
      formRef.current?.reset();
    }
  }, [state, toast]);
  
  const handleFormActionWrapper = (formData: FormData) => {
    setVideoSrc(null);
    formAction(formData);
  };

  return (
    <div className="mt-8 w-full max-w-3xl">
      <form ref={formRef} action={handleFormActionWrapper} className="space-y-4">
        <Card className="shadow-lg">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <Textarea
                        name="prompt"
                        placeholder="e.g., A majestic lion roaring on a rocky outcrop at sunset..."
                        className="min-h-[100px] resize-none text-base focus:ring-accent"
                        required
                    />
                    <div className="flex justify-end">
                        <SubmitButton />
                    </div>
                </div>
            </CardContent>
        </Card>
        <VideoDisplay videoSrc={videoSrc} />
      </form>
    </div>
  );
}
