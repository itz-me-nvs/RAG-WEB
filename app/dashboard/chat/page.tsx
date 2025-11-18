'use client';

import CitationExporter from "@/components/CitationExporter";
import ConversationExporter from "@/components/ConversationExporter";
import DocumentGenerationControls from "@/components/DocumentGenerationControls";
import DocumentPreviewModal from "@/components/DocumentPreviewModal";
import GeneratedDocumentCard from "@/components/GeneratedDocumentCard";
import { OutputStyle } from "@/components/OutputStyleSelector";
import QuestionTemplatesLibrary from "@/components/QuestionTemplatesLibrary";
import SourceReferenceModal from "@/components/SourceReferenceModal";
import {
  ChatMessage,
  getSession,
  saveSession,
  SourceReference,
  updateSession,
} from "@/lib/chatHistory";
import { API_BASE_URL } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCpu, FiDownload, FiFileText, FiLink, FiMaximize2, FiRefreshCw, FiSend, FiTrash2, FiUpload, FiX, FiZoomIn, FiZoomOut } from "react-icons/fi";

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
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [asking, setAsking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [selectedSources, setSelectedSources] = useState<SourceReference[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: string, uploadedAt: Date}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New feature states
  const [showTemplatesLibrary, setShowTemplatesLibrary] = useState(false);
  const [outputStyle, setOutputStyle] = useState<OutputStyle>('natural');
  const [showCitationExporter, setShowCitationExporter] = useState(false);
  const [showConversationExporter, setShowConversationExporter] = useState(false);
  const [documentIntelligence, setDocumentIntelligence] = useState<any>(null);
  const [intelligenceLoading, setIntelligenceLoading] = useState(false);

  // Credit system states
  const [credits, setCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (sessionId) {
      // Load existing session
      const session = getSession(sessionId);
      if (session) {
        setCurrentSessionId(session.id);
        setChat(session.messages);
        localStorage.setItem("request_id", session.requestId);
        setIsReady(true);
      }
    } else {
      // New session - clear request_id
      localStorage.removeItem("request_id");
      setIsReady(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Load user credits on mount
  useEffect(() => {
    // TODO: Replace with actual API call to backend
    // Example: const response = await fetch('/api/user/credits');
    // For now, using mock data
    setTimeout(() => {
      setCredits(15); // Mock data - set low to demonstrate warning
      setCreditsLoading(false);
    }, 500);
  }, []);

  // Simulate progress for better UX
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const allowedFileTypes = [".pdf", ".txt", ".docx"];
      const fileName = droppedFile.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf("."));

      if (allowedFileTypes.includes(fileExtension)) {
        setFile(droppedFile);
        setUrl("");
        // Create preview URL for PDF
        if (fileExtension === ".pdf") {
          const objectUrl = URL.createObjectURL(droppedFile);
          setPdfUrl(objectUrl);
        }
      } else {
        alert("Invalid file type. Please select a .pdf, .txt, or .docx file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const allowedFileTypes = [".pdf", ".txt", ".docx"];
        const fileName = selectedFile.name.toLowerCase();
        const fileExtension = fileName.substring(fileName.lastIndexOf("."));

        if (allowedFileTypes.includes(fileExtension)) {
          setFile(selectedFile);
          setUrl("");
          // Create preview URL for PDF
          if (fileExtension === ".pdf") {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPdfUrl(objectUrl);
            setShowPdfViewer(true);
          }
        } else {
          alert("Invalid file type. Please select a .pdf, .txt, or .docx file.");
          e.target.value = "";
        }
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setFile(null);
    setPdfUrl(null);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setUploading(true);
    setChat([]);
    setCurrentSessionId(null); // Reset session for new upload
    const progressInterval = simulateProgress();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data.response && data.response.request_id) {
        localStorage.setItem("request_id", data.response.request_id);
        setIsReady(true);
        // setChat((prevChat) => [...prevChat, { type: "bot", text: "File uploaded successfully. You can now ask questions." }]);
        generateSuggestedQuestions();
        generateDocumentIntelligence();
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type || 'unknown',
          uploadedAt: new Date()
        }]);
        setChat((prevChat) => [...prevChat, {
          type: "bot",
          text: `✓ ${file.name} uploaded successfully! You can now ask questions about this document.`
        }]);
        setShowUploadModal(false);

        // Keep PDF viewer open if it's a PDF
        if (file.name.toLowerCase().endsWith('.pdf')) {
          setShowPdfViewer(true);
        }

        setTimeout(() => {
          setFile(null);
          setUploadProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setUploadProgress(0);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error uploading the file." }]);
    }
    setUploading(false);
  };

  const handleUrlSubmit = async () => {
    if (!url) return;
    setUploading(true);
    setChat([]);
    setCurrentSessionId(null); // Reset session for new URL
    const progressInterval = simulateProgress();

    try {
      const response = await fetch(`${API_BASE_URL}/api/load-from-web`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data.response && data.response.request_id) {
        localStorage.setItem("request_id", data.response.request_id);
        setIsReady(true);
        // setChat((prevChat) => [...prevChat, { type: "bot", text: "URL processed successfully. You can now ask questions." }]);
        generateSuggestedQuestions();
        setUploadedFiles(prev => [...prev, {
          name: url,
          type: 'url',
          uploadedAt: new Date()
        }]);
        setChat((prevChat) => [...prevChat, {
          type: "bot",
          text: "✓ URL processed successfully! You can now ask questions about this content."
        }]);
        setShowUploadModal(false);
        setTimeout(() => {
          setUrl("");
          setUploadProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setUploadProgress(0);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error processing the URL." }]);
    }
    setUploading(false);
  };

  const generateSuggestedQuestions = () => {
    const suggestions = [
      "What is the main topic of this document?",
      "Can you summarize the key points?",
      "What are the important details mentioned?",
      "Are there any specific dates or numbers mentioned?",
    ];
    setSuggestedQuestions(suggestions);
  };

  const generateDocumentIntelligence = async () => {
    setIntelligenceLoading(true);
    try {
      // In production, this would call your backend API
      // For now, using mock data to demonstrate the feature
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockIntelligence = {
        summary: "This document contains important information about the subject matter. Key insights and actionable items have been identified for quick reference.",
        keyTopics: ["Main Topic", "Analysis", "Conclusions", "Recommendations", "Data Insights"],
        entities: {
          people: ["John Doe", "Jane Smith", "Dr. Johnson"],
          organizations: ["Acme Corp", "Tech Solutions Inc"],
          locations: ["San Francisco", "New York"],
          dates: ["2024", "Q1 2024", "March 15"],
        },
        statistics: {
          wordCount: 5420,
          pageCount: uploadedFiles[0]?.name.endsWith('.pdf') ? 12 : 1,
          readingTime: "22 min",
        },
      };

      setDocumentIntelligence(mockIntelligence);
    } catch (error) {
      console.error("Failed to generate intelligence:", error);
    } finally {
      setIntelligenceLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
  };

  const handleQuestionSubmit = async () => {
    if (!question || asking) return;
    setAsking(true);
    const newUserMessage: ChatMessage = { type: "user", text: question };
    setChat((prevChat) => [...prevChat, newUserMessage]);
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
        // Extract sources from the API response
        let sources: SourceReference[] = [];

        // Check for various possible source formats from backend
        if (data.response.sources) {
          sources = data.response.sources;
        } else if (data.response.context) {
          // If backend returns context as a single string or array
          if (Array.isArray(data.response.context)) {
            sources = data.response.context.map((ctx: any) => ({
              content: typeof ctx === 'string' ? ctx : ctx.content || ctx.text,
              pageNumber: ctx.page_number || ctx.pageNumber,
              score: ctx.score || ctx.similarity,
              metadata: ctx.metadata,
            }));
          } else if (typeof data.response.context === 'string') {
            sources = [{ content: data.response.context }];
          }
        } else if (data.response.retrieved_chunks) {
          sources = data.response.retrieved_chunks.map((chunk: any) => ({
            content: chunk.content || chunk.text,
            pageNumber: chunk.page_number || chunk.pageNumber,
            score: chunk.score,
            metadata: chunk.metadata,
          }));
        }

        const newBotMessage: ChatMessage = {
          type: "bot",
          text: data.response.answer,
          sources: sources.length > 0 ? sources : undefined,
        };

        setChat((prevChat) => {
          const updatedChat = [...prevChat, newBotMessage];

          // Save or update session after successful response
          if (currentSessionId) {
            updateSession(currentSessionId, updatedChat);
          } else {
            const newSession = saveSession(request_id, updatedChat);
            setCurrentSessionId(newSession.id);
          }

          return updatedChat;
        });
      }
    } catch (error) {
      console.error(error);
      setChat((prevChat) => [...prevChat, { type: "bot", text: "Sorry, there was an error processing your question." }]);
    }
    setQuestion("");
    setAsking(false);
  };

  const handleShowSources = (sources: SourceReference[]) => {
    setSelectedSources(sources);
    setShowSourceModal(true);
  }
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
  }
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
    setIsReady(false);
    setChat([]);
    localStorage.removeItem("request_id");
    setPdfUrl(null);
    setShowPdfViewer(false);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="mx-auto w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Left side: Chat Interface */}
            <div className="md:col-span-2 flex flex-col h-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-blue-200/50">
                <header className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 md:px-8 py-6 border-b border-blue-700/30 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <FiCpu className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">RAG Chatbot</h1>
                            <p className="text-xs text-blue-100">Powered by AI</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="md:hidden rounded-xl bg-white/20 hover:bg-white/30 p-2.5 text-white shadow-lg transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
                        title="Upload document or URL"
                    >
                        <FiUpload className="h-6 w-6" />
                    </button>
                </header>

                {/* Uploaded Files Bar */}
                {uploadedFiles.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3 border-b border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-x-auto">
                                <FiFileText className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                                <div className="flex gap-2">
                                    {uploadedFiles.slice(-3).map((file, idx) => (
                                        <div key={idx} className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-emerald-700 shadow-sm border border-emerald-200 whitespace-nowrap">
                                            {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={clearUploadedFiles}
                                className="ml-3 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                                title="Clear all"
                            >
                                <FiTrash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Credit Warning Banners */}
                {!creditsLoading && credits === 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-red-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">!</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-900 mb-1">Out of Credits</h3>
                                <p className="text-sm text-red-700 mb-3">
                                    You have run out of credits. Purchase more credits to continue using the chatbot.
                                </p>
                                <a
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Buy Credits Now
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {!creditsLoading && credits > 0 && credits <= 20 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-yellow-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">⚠</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-900 mb-1">Low Credits</h3>
                                <p className="text-sm text-yellow-700 mb-3">
                                    You have only <span className="font-bold">{credits} credits</span> remaining. Consider purchasing more to avoid interruption.
                                </p>
                                <a
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition-colors"
                                >
                                    Buy More Credits
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={chatContainerRef} className="flex-1 space-y-6 overflow-y-auto p-6 max-h-[80vh]">
                    {isReady ? (
                        chat.map((message, i) => (
                        <div
                            key={i}
                            className={`chat-message flex items-start gap-4 ${
                            message.type === "user" ? "justify-end" : ""
                            } animate-fadeIn`}
                        >
                            {message.type === "bot" && (
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex-shrink-0 flex items-center justify-center shadow-md ring-2 ring-blue-200/50">
                              <FiCpu className="h-5 w-5 text-blue-600" />
                            </div>
                            )}
                            <div
                            className={`max-w-md rounded-2xl px-5 py-3 shadow-lg transition-all hover:shadow-xl ${
                                message.type === "user"
                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none ring-2 ring-blue-400/30"
                                : "bg-white text-gray-900 rounded-bl-none ring-1 ring-gray-200"
                            }`}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-6 ring-1 ring-blue-200">
                                    <FiUpload className="h-16 w-16 text-blue-500" />
                                </div>
                            </div>
                            <p className="text-xl font-semibold text-gray-700 mb-2">Get Started</p>
                            <p className="text-gray-500 text-center max-w-md">Upload a document or enter a URL to begin your AI-powered conversation.</p>
                        </div>
                    )}
                    {uploading && (
                        <div className="chat-message flex items-start gap-4 animate-fadeIn">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex-shrink-0 flex items-center justify-center shadow-md">
                                <FiRefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                            </div>
                            <div className="max-w-md rounded-2xl px-5 py-3 shadow-lg bg-white text-gray-900 rounded-bl-none ring-1 ring-gray-200">
                                <div className="flex flex-col gap-2">
                                    <span>{file ? "Uploading file..." : "Processing URL..."}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                            style={{width: `${uploadProgress}%`}}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{uploadProgress}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Generated Documents */}
                    {generatedDocuments.length > 0 && (
                        <div className="space-y-4 mt-6">
                            {generatedDocuments.map((doc) => (
                                <div key={doc.id} className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                                        <FiCpu className="h-5 w-5 text-blue-600" />
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
                <div className="flex items-center gap-3 border-t border-blue-200 p-6 bg-white/80 backdrop-blur-sm">
                    <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuestionSubmit()}
                    placeholder={isReady ? "Ask me anything about your document..." : "Upload a document first to start chatting"}
                    className="flex-1 rounded-full border-2 border-gray-200 bg-white px-6 py-3.5 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
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
                    className="rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-3.5 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md relative overflow-hidden group"
                    title="Send message"
                    >
                    {asking ? (
                        <FiRefreshCw className="h-6 w-6 animate-spin" />
                    ) : (
                        <FiSend className="h-6 w-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    </button>
                </div>
            </div>

            {/* Right side: File Upload and PDF Viewer */}
            <div className="hidden md:flex flex-col h-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-blue-200/50">
                {showPdfViewer && pdfUrl ? (
                    // PDF Viewer
                    <div className="flex flex-col h-full">
                        {/* PDF Viewer Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 border-b border-purple-700/30">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FiFileText className="h-5 w-5" />
                                    Document Preview
                                </h2>
                                <button
                                    onClick={() => setShowPdfViewer(false)}
                                    className="rounded-lg bg-white/20 hover:bg-white/30 p-2 text-white transition-all"
                                    title="Close viewer"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>

                            {/* PDF Controls */}
                            <div className="flex items-center justify-between gap-3">
                                {/* Page Navigation */}
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage <= 1}
                                        className="text-white hover:text-purple-100 disabled:opacity-40 transition-colors"
                                    >
                                        <FiChevronLeft className="h-5 w-5" />
                                    </button>
                                    <span className="text-white text-sm font-medium min-w-[60px] text-center">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage >= totalPages}
                                        className="text-white hover:text-purple-100 disabled:opacity-40 transition-colors"
                                    >
                                        <FiChevronRight className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Zoom Controls */}
                                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1.5">
                                    <button
                                        onClick={handleZoomOut}
                                        className="text-white hover:text-purple-100 p-1 transition-colors"
                                        title="Zoom out"
                                    >
                                        <FiZoomOut className="h-4 w-4" />
                                    </button>
                                    <span className="text-white text-xs font-medium min-w-[45px] text-center">
                                        {zoomLevel}%
                                    </span>
                                    <button
                                        onClick={handleZoomIn}
                                        className="text-white hover:text-purple-100 p-1 transition-colors"
                                        title="Zoom in"
                                    >
                                        <FiZoomIn className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={handleResetZoom}
                                        className="text-white hover:text-purple-100 p-1 transition-colors ml-1"
                                        title="Reset zoom"
                                    >
                                        <FiMaximize2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Page Slider */}
                            <div className="mt-3">
                                <input
                                    type="range"
                                    min="1"
                                    max={totalPages}
                                    value={currentPage}
                                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
                                    style={{
                                        background: `linear-gradient(to right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) ${((currentPage - 1) / (totalPages - 1)) * 100}%, rgba(255,255,255,0.1) ${((currentPage - 1) / (totalPages - 1)) * 100}%, rgba(255,255,255,0.1) 100%)`
                                    }}
                                />
                            </div>
                        </div>

                        {/* PDF Display Area */}
                        <div className="flex-1 overflow-auto bg-gray-100 p-4">
                            <div className="flex items-center justify-center h-full">
                                <div
                                    className="bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-300"
                                    style={{transform: `scale(${zoomLevel / 100})`}}
                                >
                                    <iframe
                                        src={`${pdfUrl}#page=${currentPage}`}
                                        className="w-[600px] h-[800px]"
                                        title="PDF Viewer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Download Button */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <a
                                href={pdfUrl}
                                download
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 py-3 text-white font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95"
                            >
                                <FiDownload className="h-5 w-5" />
                                Download PDF
                            </a>
                        </div>
                    </div>
                ) : (
                    // Upload Interface
                    <>
                        {/* Upload Document section */}
                        <div className="flex flex-col flex-grow-[3] p-8 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md">
                                    <FiUpload className="h-6 w-6 text-blue-600" />
                                </div>
                                Upload Document
                            </h2>
                            <div
                                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${
                                    dragActive
                                    ? "border-blue-500 bg-blue-50 scale-105"
                                    : "border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30 hover:border-blue-400"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
                                    <FiUpload className={`h-16 w-16 mb-4 transition-colors ${
                                        dragActive ? 'text-blue-500' : 'text-blue-400'
                                    }`} />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.txt,.docx"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
                                >
                                    Choose a file
                                </label>
                                {file && (
                                    <div className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md ring-2 ring-blue-200">
                                        <FiFileText className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm text-blue-600 font-medium">{file.name}</p>
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                setPdfUrl(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <FiX className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                <p className="mt-4 text-xs text-gray-500 text-center">
                                    {dragActive ? "Drop your file here!" : "Drag & drop or click to browse"}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">Supports: PDF, TXT, DOCX</p>
                            </div>
                            <button
                                onClick={handleFileUpload}
                                disabled={!file || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-white font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {uploading && file ? (
                                        <>
                                            <FiRefreshCw className="h-5 w-5 animate-spin" />
                                            Uploading... {uploadProgress}%
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload className="h-5 w-5" />
                                            Upload Document
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>

                        {/* Enter URL section */}
                        <div className="flex flex-col flex-grow-[1] p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-md">
                                    <FiLink className="h-6 w-6 text-emerald-600" />
                                </div>
                                Enter URL
                            </h2>
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-emerald-50/30 hover:border-emerald-400 transition-all">
                                <FiLink className="h-16 w-16 text-emerald-400 mb-4" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/document"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!url || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-3.5 text-white font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {uploading && url ? (
                                        <>
                                            <FiRefreshCw className="h-5 w-5 animate-spin" />
                                            Processing... {uploadProgress}%
                                        </>
                                    ) : (
                                        <>
                                            <FiLink className="h-5 w-5" />
                                            Process URL
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Mobile Upload Modal */}
        {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                <div className="relative w-full max-w-md max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-y-auto border border-blue-200">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowUploadModal(false)}
                        className="sticky top-4 right-4 float-right rounded-xl bg-gray-100 p-2.5 text-gray-900 hover:bg-gray-200 transition-all shadow-lg z-10"
                        title="Close"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    <div className="p-6 space-y-8 clear-both">
                        {/* Upload Document section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md">
                                    <FiUpload className="h-6 w-6 text-blue-600" />
                                </div>
                                Upload Document
                            </h2>
                            <div
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${
                                    dragActive
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/30"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <FiUpload className={`h-16 w-16 mb-4 transition-colors ${
                                    dragActive ? 'text-blue-500' : 'text-blue-400'
                                }`} />
                                <input id="file-upload-modal" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.txt,.docx" />
                                <label htmlFor="file-upload-modal" className="cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:shadow-lg text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
                                    Choose a file
                                </label>
                                {file && (
                                    <div className="mt-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                                        <FiFileText className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm text-blue-600 font-medium">{file.name}</p>
                                    </div>
                                )}
                                <p className="mt-4 text-xs text-gray-500 text-center">
                                    {dragActive ? "Drop it here!" : "Drag & drop or browse"}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">PDF, TXT, DOCX</p>
                            </div>
                            {uploading && file && (
                                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{width: `${uploadProgress}%`}}
                                    ></div>
                                </div>
                            )}
                            <button
                                onClick={handleFileUpload}
                                disabled={!file || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3.5 text-white font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                {uploading && file ? `Uploading... ${uploadProgress}%` : "Upload"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-gray-500 text-sm font-semibold">OR</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        {/* Enter URL section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-md">
                                    <FiLink className="h-6 w-6 text-emerald-600" />
                                </div>
                                Enter URL
                            </h2>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-emerald-50/30">
                                <FiLink className="h-16 w-16 text-emerald-400 mb-4" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/document"
                                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                            {uploading && url && (
                                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{width: `${uploadProgress}%`}}
                                    ></div>
                                </div>
                            )}
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!url || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-3.5 text-white font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                {uploading && url ? `Processing... ${uploadProgress}%` : "Process URL"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Source Reference Modal */}
        {showSourceModal && (
          <SourceReferenceModal
            sources={selectedSources}
            onClose={() => setShowSourceModal(false)}
          />
        )
      }
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

        {/* Question Templates Library */}
        <QuestionTemplatesLibrary
            isOpen={showTemplatesLibrary}
            onClose={() => setShowTemplatesLibrary(false)}
            onSelectQuestion={(question) => setQuestion(question)}
        />

        {/* Citation Exporter */}
        {showCitationExporter && chat.length > 0 && (
            <CitationExporter
                sources={chat
                    .filter(msg => msg.sources && msg.sources.length > 0)
                    .flatMap(msg => msg.sources || [])}
                documentTitle={uploadedFiles[0]?.name || "Document"}
                onClose={() => setShowCitationExporter(false)}
            />
        )}

        {/* Conversation Exporter */}
        {showConversationExporter && chat.length > 0 && (
            <ConversationExporter
                chat={chat}
                documentTitle={uploadedFiles[0]?.name || "Conversation"}
                onClose={() => setShowConversationExporter(false)}
            />
        )}
        <style jsx>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out;
            }
            .slider-thumb::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            .slider-thumb::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
        `}</style>
    </div>
  );
}
