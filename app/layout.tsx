import type { Metadata } from "next";
import "./chatbot.css";
import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "RAG Chatbot - AI-Powered Document Q&A",
  description: "Modern RAG chatbot with PDF viewer, document management, and intelligent Q&A powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
