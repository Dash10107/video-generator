'use server';

/**
 * @fileOverview Generates a video and audio from a text prompt.
 *
 * - generateVideoFromPrompt - A function that handles the video and audio generation process.
 * - GenerateVideoFromPromptInput - The input type for the generateVideoFromPrompt function.
 * - GenerateVideoFromPromptOutput - The return type for the generateVideoFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { MediaPart } from 'genkit/media';
import wav from 'wav';


const MAX_RETRIES = 3;

const GenerateVideoFromPromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use for video generation.'),
});
export type GenerateVideoFromPromptInput = z.infer<typeof GenerateVideoFromPromptInputSchema>;

const GenerateVideoFromPromptOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI.'),
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
export type GenerateVideoFromPromptOutput = z.infer<typeof GenerateVideoFromPromptOutputSchema>;

export async function generateVideoFromPrompt(input: GenerateVideoFromPromptInput): Promise<GenerateVideoFromPromptOutput> {
  return generateVideoFromPromptFlow(input);
}

async function generateVideo(prompt: string) {
    let lastError: Error | null = null;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            let { operation } = await ai.generate({
                model: googleAI.model('veo-2.0-generate-001'),
                prompt: prompt,
                config: {
                    durationSeconds: 5,
                    aspectRatio: '16:9',
                },
            });

            if (!operation) {
                throw new Error('Expected the model to return an operation');
            }
            
            while (!operation.done) {
                operation = await ai.checkOperation(operation);
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }

            if (operation.error) {
                throw new Error('failed to generate video: ' + operation.error.message);
            }

            const video = operation.output?.message?.content.find((p) => !!p.media);
            if (!video) {
                throw new Error('Failed to find the generated video');
            }
            
            return await convertVideoToDataUri(video);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`Video generation attempt ${i+1} failed:`, lastError.message);
        }
    }
    throw new Error(`Video generation failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
}

async function generateAudio(prompt: string) {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: prompt,
    });
    if (!media) {
      throw new Error('no media returned from TTS model');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    return `data:audio/wav;base64,${wavData}`;
}

const generateVideoFromPromptFlow = ai.defineFlow(
  {
    name: 'generateVideoFromPromptFlow',
    inputSchema: GenerateVideoFromPromptInputSchema,
    outputSchema: GenerateVideoFromPromptOutputSchema,
  },
  async (input) => {
    const [videoResult, audioResult] = await Promise.allSettled([
        generateVideo(input.prompt),
        generateAudio(input.prompt)
    ]);

    if (videoResult.status === 'rejected') {
        throw videoResult.reason;
    }
    if (audioResult.status === 'rejected') {
        // We can still return the video even if audio fails
        console.error('Audio generation failed:', audioResult.reason);
        return { videoDataUri: videoResult.value, audioDataUri: '' };
    }

    return { 
        videoDataUri: videoResult.value,
        audioDataUri: audioResult.value,
    };
  }
);

async function convertVideoToDataUri(video: MediaPart): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (
        !videoDownloadResponse ||
        videoDownloadResponse.status !== 200 ||
        !videoDownloadResponse.body
    ) {
        throw new Error(`Failed to fetch video. Status: ${videoDownloadResponse.status}`);
    }

    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const contentType = video.media?.contentType || 'video/mp4';
    return `data:${contentType};base64,${videoBase64}`;
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
