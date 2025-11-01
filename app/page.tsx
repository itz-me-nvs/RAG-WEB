'use client';

import { useEffect, useRef, useState } from "react";
import { FiCpu, FiLink, FiSend, FiUpload } from "react-icons/fi";
import { API_BASE_URL } from "../lib/constants";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [chat, setChat] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.removeItem("request_id");
    setIsReady(false);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const allowedFileTypes = [".pdf", ".txt", ".docx"];
        console.log(selectedFile);
        const fileName = selectedFile.name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf("."));

        if (allowedFileTypes.includes(fileExtension)) {
          setFile(selectedFile);
          setUrl("");
        } else {
          alert("Invalid file type. Please select a .pdf, .txt, or .docx file.");
          // Reset the file input
          e.target.value = "";
        }
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setUploading(true);
    setChat([]);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.response && data.response.request_id) {
        localStorage.setItem("request_id", data.response.request_id);
        setIsReady(true);
        setChat((prevChat) => [...prevChat, { type: "bot", text: "File uploaded successfully. You can now ask questions." }]);
      }
    } catch (error) {
      console.error(error);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error uploading the file." }]);
    }
    setUploading(false);
  };

  const handleUrlSubmit = async () => {
    if (!url) return;
    setUploading(true);
    setChat([]);
    try {
      const response = await fetch(`${API_BASE_URL}/api/load-from-web`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.response && data.response.request_id) {
        localStorage.setItem("request_id", data.response.request_id);
        setIsReady(true);
        setChat((prevChat) => [...prevChat, { type: "bot", text: "URL processed successfully. You can now ask questions." }]);
        setUrl("");
      }
    } catch (error) {
      console.error(error);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error processing the URL." }]);
    }
    setUploading(false);
  };

  const handleQuestionSubmit = async () => {
    if (!question || asking) return;
    setAsking(true);
    setChat((prevChat) => [...prevChat, { type: "user", text: question }]);
    const request_id = localStorage.getItem("request_id");

    if (!request_id) {
        setChat((prevChat) => [...prevChat, { type: "bot", text: "Please upload a file or submit a URL first." }]);
        setAsking(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/custom-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, request_id }),
      });
      const data = await response.json();
      if (data.response && data.response.answer) {
        setChat((prevChat) => [...prevChat, { type: "bot", text: data.response.answer }]);
      }
    } catch (error) {
      console.error(error);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error processing your question." }]);
    }
    setQuestion("");
    setAsking(false);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-100 dark:bg-zinc-900 p-8">
        <div className="mx-auto w-full h-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left side: Chat Interface */}
            <div className="md:col-span-2 flex flex-col h-full bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl">
                <header className="flex items-center justify-between rounded-t-2xl bg-zinc-50 dark:bg-zinc-700 px-6 py-4 border-b border-zinc-200 dark:border-zinc-600">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">RAG Chatbot</h1>
                </header>
                <div ref={chatContainerRef} className="flex-1 space-y-6 overflow-y-auto p-6 max-h-[80vh]">
                    {isReady ? (
                        chat.map((message, i) => (
                        <div
                            key={i}
                            className={`chat-message flex items-start gap-4 ${
                            message.type === "user" ? "justify-end" : ""
                            }`}
                        >
                            {message.type === "bot" && (
                            <div className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0 flex items-center justify-center">
                              <FiCpu className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            )}
                            <div
                            className={`max-w-md rounded-2xl px-5 py-3 shadow-md ${
                                message.type === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                            }`}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
                            <FiUpload className="h-16 w-16 mb-4" />
                            <p className="text-lg">Please upload a document or enter a URL to start chatting.</p>
                        </div>
                    )}
                    {uploading && (
                        <div className="chat-message flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0 flex items-center justify-center">
                                <FiCpu className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <div className="max-w-md rounded-2xl px-5 py-3 shadow-md bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100">
                                {file ? "Uploading file..." : "Processing URL..."}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 border-t border-zinc-200 dark:border-zinc-600 p-4">
                    <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuestionSubmit()}
                    placeholder={isReady ? "Type your message..." : "Upload a document or submit a URL to start"}
                    className="flex-1 rounded-full border border-zinc-300 bg-transparent px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:focus:ring-blue-500"
                    disabled={!isReady || asking}
                    />
                    <button
                    onClick={handleQuestionSubmit}
                    disabled={!isReady || !question || asking}
                    className="rounded-full bg-blue-500 p-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:bg-blue-300"
                    >
                    <FiSend className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Right side: File Upload and URL Input */}
            <div className="flex flex-col h-full bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6">
                <div className="flex flex-col flex-grow-[3]"> {/* Upload Document section */}
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Upload Document</h2>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8">
                        <FiUpload className="h-16 w-16 text-zinc-400 dark:text-zinc-500 mb-4" />
                        <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95">
                            Choose a file
                        </label>
                        {file && <p className="mt-4 text-zinc-600 dark:text-zinc-400">{file.name}</p>}
                    </div>
                    <button
                        onClick={handleFileUpload}
                        disabled={!file || uploading}
                        className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-white font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:bg-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                        {uploading && file ? "Uploading..." : "Upload"}
                    </button>
                </div>
                <div className="flex flex-col flex-grow-[1]"> {/* Enter URL section */}
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Enter URL</h2>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-8">
                        <FiLink className="h-16 w-16 text-zinc-400 dark:text-zinc-500 mb-4" />
                        <input
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
                            placeholder="Enter a URL"
                            className="w-full rounded-full border border-zinc-300 bg-transparent px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleUrlSubmit}
                        disabled={!url || uploading}
                        className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-white font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:bg-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                        {uploading && url ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}