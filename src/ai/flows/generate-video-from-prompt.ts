'use server';

/**
 * @fileOverview Generates a video from a text prompt using the Veo3 API.
 *
 * - generateVideoFromPrompt - A function that handles the video generation process.
 * - GenerateVideoFromPromptInput - The input type for the generateVideoFromPrompt function.
 * - GenerateVideoFromPromptOutput - The return type for the generateVideoFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import * as fs from 'fs';
import { Readable } from 'stream';

const GenerateVideoFromPromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use for video generation.'),
});
export type GenerateVideoFromPromptInput = z.infer<typeof GenerateVideoFromPromptInputSchema>;

const GenerateVideoFromPromptOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI.'),
});
export type GenerateVideoFromPromptOutput = z.infer<typeof GenerateVideoFromPromptOutputSchema>;

export async function generateVideoFromPrompt(input: GenerateVideoFromPromptInput): Promise<GenerateVideoFromPromptOutput> {
  return generateVideoFromPromptFlow(input);
}

const generateVideoFromPromptFlow = ai.defineFlow(
  {
    name: 'generateVideoFromPromptFlow',
    inputSchema: GenerateVideoFromPromptInputSchema,
    outputSchema: GenerateVideoFromPromptOutputSchema,
  },
  async input => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    const videoPath = 'output.mp4';
    await downloadVideo(video, videoPath);

    // Read the video file and convert it to a data URI.
    const videoData = fs.readFileSync(videoPath);
    const videoBase64 = videoData.toString('base64');
    const videoDataUri = `data:video/mp4;base64,${videoBase64}`;

    // Delete the temporary video file.
    fs.unlinkSync(videoPath);

    return { videoDataUri };
  }
);

async function downloadVideo(video: any, path: string) {
  const fetch = (await import('node-fetch')).default;
    // Add API key before fetching the video.
  const videoDownloadResponse = await fetch(
    `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  Readable.from(videoDownloadResponse.body).pipe(fs.createWriteStream(path));
}

