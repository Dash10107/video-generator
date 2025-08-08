import { VideoGenerator } from '@/components/video-generator';
import { Bot, Clapperboard, Languages } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto flex flex-col items-center justify-center p-4 text-center">
        
        <div className="py-20 md:py-32">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl lg:text-8xl 
                         bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            VeoVerse Studio
          </h1>
          <p className="mt-6 max-w-3xl font-body text-lg text-foreground/80 md:text-xl">
            Bring your ideas to life. Describe a scene, a story, or a concept, and watch our AI create a stunning video with synchronized narration in any language.
          </p>
        </div>

        <VideoGenerator />

        <div className="mt-24 w-full max-w-5xl">
          <h2 className="text-3xl font-bold font-headline text-primary/90">Powered by a Modern AI Stack</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="rounded-full bg-accent/10 p-3">
                <Clapperboard className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Generative Video</h3>
              <p className="text-sm text-muted-foreground">Utilizing Google's Veo model to create high-quality, dynamic video content from text prompts.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="rounded-full bg-accent/10 p-3">
                <Languages className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Multilingual Audio</h3>
              <p className="text-sm text-muted-foreground">Generating natural-sounding narration in multiple languages with advanced Text-to-Speech.</p>
            </div>
             <div className="flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="rounded-full bg-accent/10 p-3">
                <Bot className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">AI Integration</h3>
              <p className="text-sm text-muted-foreground">Seamlessly orchestrated by Firebase Genkit for a robust and scalable AI backend.</p>
            </div>
          </div>
        </div>

        <footer className="mt-24 py-8 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ using Firebase Studio</p>
        </footer>

      </div>
    </main>
  );
}
