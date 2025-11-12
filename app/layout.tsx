import type { Metadata } from "next";
import "./chatbot.css";
import "./globals.css";

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
    <html lang="en">
      <head>
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
