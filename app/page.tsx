'use client';

import { useEffect, useRef, useState } from "react";
import { FiCpu, FiLink, FiSend, FiUpload, FiX } from "react-icons/fi";
import { API_BASE_URL } from "../lib/constants";
import GeneratedDocumentCard from "../components/GeneratedDocumentCard";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
import DocumentGenerationControls from "../components/DocumentGenerationControls";

interface GeneratedDocument {
  id: string;
  type: 'pdf' | 'slider';
  title: string;
  description?: string;
  pageCount?: number;
  createdAt: string;
  pdfUrl?: string;
  slides?: Array<{
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
  }>;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [chat, setChat] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
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
        setShowUploadModal(false);
        setFile(null);
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
        setShowUploadModal(false);
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

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    const request_id = localStorage.getItem("request_id");

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // Simulating API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument: GeneratedDocument = {
        id: `pdf-${Date.now()}`,
        type: 'pdf',
        title: 'Conversation Summary',
        description: 'A comprehensive PDF document generated from your conversation',
        pageCount: 5,
        createdAt: new Date().toLocaleDateString(),
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Example PDF
      };

      setGeneratedDocuments(prev => [...prev, newDocument]);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "✅ PDF document generated successfully! You can view and download it below." }]);
    } catch (error) {
      console.error(error);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error generating the PDF." }]);
    }

    setIsGenerating(false);
  };

  const handleGenerateSlides = async () => {
    setIsGenerating(true);
    const request_id = localStorage.getItem("request_id");

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // Simulating API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument: GeneratedDocument = {
        id: `slides-${Date.now()}`,
        type: 'slider',
        title: 'Presentation Slides',
        description: 'Key insights and highlights from your document',
        pageCount: 8,
        createdAt: new Date().toLocaleDateString(),
        slides: [
          {
            id: 1,
            title: 'Introduction',
            content: 'Welcome to your auto-generated presentation. This slide deck summarizes the key points from your conversation and uploaded documents.',
          },
          {
            id: 2,
            title: 'Key Findings',
            content: '• Main insight #1 from your document\n• Important point #2 discovered in conversation\n• Critical information #3 highlighted\n• Additional detail #4',
          },
          {
            id: 3,
            title: 'Data Analysis',
            content: 'Based on the processed content, we identified several important patterns and trends that are worth discussing in more detail.',
          },
          {
            id: 4,
            title: 'Summary',
            content: 'This presentation captures the essence of your conversation and provides a structured overview for easy sharing and presentation.',
          },
        ],
      };

      setGeneratedDocuments(prev => [...prev, newDocument]);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "✅ Presentation slides generated successfully! You can view and download them below." }]);
    } catch (error) {
      console.error(error);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error generating the slides." }]);
    }

    setIsGenerating(false);
  };

  const handlePreviewDocument = (document: GeneratedDocument) => {
    setPreviewDocument(document);
    setShowPreviewModal(true);
  };

  const handleDownloadDocument = (document: GeneratedDocument) => {
    // TODO: Implement actual download functionality when backend is ready
    console.log('Downloading document:', document.id);
    alert(`Download functionality will be implemented with backend integration.\nDocument: ${document.title}`);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setTimeout(() => setPreviewDocument(null), 300);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="mx-auto w-full h-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side: Chat Interface */}
            <div className="md:col-span-2 flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <header className="flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-6 md:px-8 py-6 border-b border-primary-600">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">RAG Chatbot</h1>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="md:hidden rounded-full bg-white/20 hover:bg-white/30 p-2.5 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
                        title="Upload document or URL"
                    >
                        <FiUpload className="h-6 w-6" />
                    </button>
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
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex-shrink-0 flex items-center justify-center shadow-sm">
                              <FiCpu className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                            </div>
                            )}
                            <div
                            className={`max-w-md rounded-2xl px-5 py-3 shadow-lg transition-all hover:shadow-xl ${
                                message.type === "user"
                                ? "bg-primary-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                            }`}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                            <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-900 mb-6">
                                <FiUpload className="h-16 w-16 text-primary-400" />
                            </div>
                            <p className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Get Started</p>
                            <p className="text-gray-500 dark:text-gray-400">Upload a document or enter a URL to start chatting.</p>
                        </div>
                    )}
                    {uploading && (
                        <div className="chat-message flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex-shrink-0 flex items-center justify-center shadow-sm">
                                <FiCpu className="h-5 w-5 text-primary-600 dark:text-primary-300 loading-indicator" />
                            </div>
                            <div className="max-w-md rounded-2xl px-5 py-3 shadow-lg bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none">
                                {file ? "Uploading file..." : "Processing URL..."}
                            </div>
                        </div>
                    )}
                    {/* Generated Documents */}
                    {generatedDocuments.length > 0 && (
                        <div className="space-y-4 mt-6">
                            {generatedDocuments.map((doc) => (
                                <div key={doc.id} className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <FiCpu className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                                    </div>
                                    <GeneratedDocumentCard
                                        type={doc.type}
                                        title={doc.title}
                                        description={doc.description}
                                        pageCount={doc.pageCount}
                                        createdAt={doc.createdAt}
                                        onPreview={() => handlePreviewDocument(doc)}
                                        onDownload={() => handleDownloadDocument(doc)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
                    <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuestionSubmit()}
                    placeholder={isReady ? "Ask a question..." : "Upload a document or submit a URL to start"}
                    className="flex-1 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={!isReady || asking}
                    />
                    <DocumentGenerationControls
                        onGeneratePDF={handleGeneratePDF}
                        onGenerateSlides={handleGenerateSlides}
                        disabled={!isReady || chat.length === 0}
                        isGenerating={isGenerating}
                    />
                    <button
                    onClick={handleQuestionSubmit}
                    disabled={!isReady || !question || asking}
                    className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 p-3 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md"
                    title="Send message"
                    >
                    <FiSend className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Right side: File Upload and URL Input - Hidden on Mobile */}
            <div className="hidden md:flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Upload Document section */}
                <div className="flex flex-col flex-grow-[3] p-8 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                            <FiUpload className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                        </div>
                        Upload Document
                    </h2>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <FiUpload className="h-16 w-16 text-primary-300 dark:text-primary-700 mb-4" />
                        <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="file-upload" className="cursor-pointer bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
                            Choose a file
                        </label>
                        {file && <p className="mt-4 text-sm text-primary-600 dark:text-primary-300 font-medium text-center">{file.name}</p>}
                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Supports: PDF, TXT, DOCX</p>
                    </div>
                    <button
                        onClick={handleFileUpload}
                        disabled={!file || uploading}
                        className="mt-6 w-full rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 py-3 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                        >
                        {uploading && file ? "Uploading..." : "Upload"}
                    </button>
                </div>

                {/* Enter URL section */}
                <div className="flex flex-col flex-grow-[1] p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-900">
                            <FiLink className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
                        </div>
                        Enter URL
                    </h2>
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gray-50 dark:bg-gray-700">
                        <FiLink className="h-16 w-16 text-secondary-300 dark:text-secondary-700 mb-4" />
                        <input
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
                            placeholder="Enter a URL"
                            className="w-full rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <button
                        onClick={handleUrlSubmit}
                        disabled={!url || uploading}
                        className="mt-6 w-full rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 py-3 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                        >
                        {uploading && url ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Upload Modal */}
        {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowUploadModal(false)}
                        className="sticky top-4 right-4 float-right rounded-full bg-gray-100 dark:bg-gray-700 p-2.5 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        title="Close"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    <div className="p-6 space-y-8">
                        {/* Upload Document section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                                    <FiUpload className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                                </div>
                                Upload Document
                            </h2>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gray-50 dark:bg-gray-700">
                                <FiUpload className="h-16 w-16 text-primary-300 dark:text-primary-700 mb-4" />
                                <input id="file-upload-modal" type="file" onChange={handleFileChange} className="hidden" />
                                <label htmlFor="file-upload-modal" className="cursor-pointer bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
                                    Choose a file
                                </label>
                                {file && <p className="mt-4 text-sm text-primary-600 dark:text-primary-300 font-medium text-center">{file.name}</p>}
                                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Supports: PDF, TXT, DOCX</p>
                            </div>
                            <button
                                onClick={handleFileUpload}
                                disabled={!file || uploading}
                                className="mt-6 w-full rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 py-3 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                {uploading && file ? "Uploading..." : "Upload"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                        </div>

                        {/* Enter URL section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-900">
                                    <FiLink className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
                                </div>
                                Enter URL
                            </h2>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gray-50 dark:bg-gray-700">
                                <FiLink className="h-16 w-16 text-secondary-300 dark:text-secondary-700 mb-4" />
                                <input
                                    type="text"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="Enter a URL"
                                    className="w-full rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!url || uploading}
                                className="mt-6 w-full rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 py-3 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                {uploading && url ? "Processing..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Document Preview Modal */}
        {previewDocument && (
            <DocumentPreviewModal
                isOpen={showPreviewModal}
                onClose={handleClosePreview}
                type={previewDocument.type}
                title={previewDocument.title}
                pdfUrl={previewDocument.pdfUrl}
                slides={previewDocument.slides}
                onDownload={() => handleDownloadDocument(previewDocument)}
            />
        )}
    </div>
  );
}