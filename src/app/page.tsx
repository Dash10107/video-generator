import { VideoGenerator } from '@/components/video-generator';

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
          Sahayak + Veo
        </h1>
        <p className="mt-4 font-body text-lg text-foreground/80 md:text-xl">
          Bring your ideas to life. Describe a scene and watch it unfold.
        </p>
      </div>
      <VideoGenerator />
    </main>
  );
}
