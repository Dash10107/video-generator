# VeoVerse: AI Video Generation Studio

VeoVerse is a cutting-edge web application that brings your ideas to life by transforming simple text prompts into dynamic, engaging videos complete with synchronized audio. Built with a modern, AI-first technology stack, this project serves as a powerful demonstration of generative AI's creative potential.

![VeoVerse Screenshot](https://placehold.co/800x400.png?text=VeoVerse+UI)

## ✨ Features

- **📝 Text-to-Video Generation**: Describe a scene, and our AI, powered by Google's Veo model, will generate a high-quality video for you.
- **🔊 AI-Powered Narration**: Automatically generates a synchronized audio track for your video using advanced Text-to-Speech (TTS) technology.
- **🌐 Multilingual Support**: Create content for a global audience with built-in multilingual audio generation.
- **🚀 Modern Tech Stack**: Built with Next.js, React, and Tailwind CSS for a fast, responsive, and beautiful user experience.
- **🤖 Genkit Backend**: Leverages Firebase Genkit to seamlessly integrate with Google's generative AI models.
- **💪 Resilient & Reliable**: Includes built-in retry mechanisms to handle intermittent API errors, ensuring a smoother user experience.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Video Generation**: Google Veo
- **Audio Generation**: Google Cloud TTS
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Getting Started

To get this project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

---

This project was built using **Firebase Studio**, an AI-powered development environment for building and deploying full-stack applications.