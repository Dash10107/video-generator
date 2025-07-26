'use server';

import { generateVideoFromPrompt } from '@/ai/flows/generate-video-from-prompt';
import { z } from 'zod';

const promptSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long.'),
});

interface FormState {
    error: string | null;
    video: string | null;
}

export async function handleVideoGeneration(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = promptSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.prompt?.[0] || 'Invalid prompt.',
      video: null,
    };
  }

  try {
    const result = await generateVideoFromPrompt({ prompt: validatedFields.data.prompt });
    return {
      error: null,
      video: result.videoDataUri,
    };
  } catch (error) {
    console.error('Video generation failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      error: `Failed to generate video. Please try again.`,
      video: null,
    };
  }
}
