'use client';

import { useEffect, useRef, useState } from "react";
import { FiCpu, FiLink, FiSend, FiUpload, FiX, FiDownload, FiFileText, FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiMaximize2, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { API_BASE_URL } from "../lib/constants";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [chat, setChat] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [asking, setAsking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: string, uploadedAt: Date}[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.removeItem("request_id");
    setIsReady(false);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

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
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-4 md:p-8">
        <div className="mx-auto w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Left side: Chat Interface */}
            <div className="md:col-span-2 flex flex-col h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                <header className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 px-6 md:px-8 py-6 border-b border-blue-700/30 shadow-lg">
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
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-3 border-b border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-x-auto">
                                <FiFileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <div className="flex gap-2">
                                    {uploadedFiles.slice(-3).map((file, idx) => (
                                        <div key={idx} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-700 whitespace-nowrap">
                                            {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={clearUploadedFiles}
                                className="ml-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex-shrink-0"
                                title="Clear all"
                            >
                                <FiTrash2 className="h-4 w-4" />
                            </button>
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
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 flex-shrink-0 flex items-center justify-center shadow-md ring-2 ring-blue-200/50 dark:ring-blue-700/50">
                              <FiCpu className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            )}
                            <div
                            className={`max-w-md rounded-2xl px-5 py-3 shadow-lg transition-all hover:shadow-xl ${
                                message.type === "user"
                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none ring-2 ring-blue-400/30"
                                : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none ring-1 ring-gray-200 dark:ring-gray-600"
                            }`}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 mb-6 ring-1 ring-blue-200 dark:ring-blue-800">
                                    <FiUpload className="h-16 w-16 text-blue-500 dark:text-blue-400" />
                                </div>
                            </div>
                            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Get Started</p>
                            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">Upload a document or enter a URL to begin your AI-powered conversation.</p>
                        </div>
                    )}
                    {uploading && (
                        <div className="chat-message flex items-start gap-4 animate-fadeIn">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 flex-shrink-0 flex items-center justify-center shadow-md">
                                <FiRefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-300 animate-spin" />
                            </div>
                            <div className="max-w-md rounded-2xl px-5 py-3 shadow-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none ring-1 ring-gray-200 dark:ring-gray-600">
                                <div className="flex flex-col gap-2">
                                    <span>{file ? "Uploading file..." : "Processing URL..."}</span>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                            style={{width: `${uploadProgress}%`}}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{uploadProgress}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuestionSubmit()}
                    placeholder={isReady ? "Ask me anything about your document..." : "Upload a document first to start chatting"}
                    className="flex-1 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3.5 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    disabled={!isReady || asking}
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
            <div className="hidden md:flex flex-col h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                {showPdfViewer && pdfUrl ? (
                    // PDF Viewer
                    <div className="flex flex-col h-full">
                        {/* PDF Viewer Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 px-6 py-4 border-b border-purple-700/30">
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
                        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
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
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <a
                                href={pdfUrl}
                                download
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 text-white font-semibold shadow-lg transition-all hover:shadow-xl active:scale-95"
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
                        <div className="flex flex-col flex-grow-[3] p-8 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 shadow-md">
                                    <FiUpload className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                Upload Document
                            </h2>
                            <div
                                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${
                                    dragActive
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
                                    : "border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-700 dark:to-blue-900/10 hover:border-blue-400 dark:hover:border-blue-500"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
                                    <FiUpload className={`h-16 w-16 mb-4 transition-colors ${
                                        dragActive ? 'text-blue-500' : 'text-blue-400 dark:text-blue-600'
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
                                    <div className="mt-4 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md ring-2 ring-blue-200 dark:ring-blue-800">
                                        <FiFileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">{file.name}</p>
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
                                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {dragActive ? "Drop your file here!" : "Drag & drop or click to browse"}
                                </p>
                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Supports: PDF, TXT, DOCX</p>
                            </div>
                            <button
                                onClick={handleFileUpload}
                                disabled={!file || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100 py-3.5 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed relative overflow-hidden group"
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 shadow-md">
                                    <FiLink className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                Enter URL
                            </h2>
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-gray-700 dark:to-emerald-900/10 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
                                <FiLink className="h-16 w-16 text-emerald-400 dark:text-emerald-600 mb-4" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/document"
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!url || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100 py-3.5 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
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
                <div className="relative w-full max-w-md max-h-[90vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-y-auto border border-gray-200 dark:border-gray-700">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowUploadModal(false)}
                        className="sticky top-4 right-4 float-right rounded-xl bg-gray-100 dark:bg-gray-700 p-2.5 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-lg z-10"
                        title="Close"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    <div className="p-6 space-y-8 clear-both">
                        {/* Upload Document section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 shadow-md">
                                    <FiUpload className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                Upload Document
                            </h2>
                            <div
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 transition-all ${
                                    dragActive
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-700 dark:to-blue-900/10"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <FiUpload className={`h-16 w-16 mb-4 transition-colors ${
                                    dragActive ? 'text-blue-500' : 'text-blue-400 dark:text-blue-600'
                                }`} />
                                <input id="file-upload-modal" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.txt,.docx" />
                                <label htmlFor="file-upload-modal" className="cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:shadow-lg text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
                                    Choose a file
                                </label>
                                {file && (
                                    <div className="mt-4 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                                        <FiFileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">{file.name}</p>
                                    </div>
                                )}
                                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {dragActive ? "Drop it here!" : "Drag & drop or browse"}
                                </p>
                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">PDF, TXT, DOCX</p>
                            </div>
                            {uploading && file && (
                                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{width: `${uploadProgress}%`}}
                                    ></div>
                                </div>
                            )}
                            <button
                                onClick={handleFileUpload}
                                disabled={!file || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100 py-3.5 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                {uploading && file ? `Uploading... ${uploadProgress}%` : "Upload"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold">OR</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                        </div>

                        {/* Enter URL section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 shadow-md">
                                    <FiLink className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                Enter URL
                            </h2>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-gray-700 dark:to-emerald-900/10">
                                <FiLink className="h-16 w-16 text-emerald-400 dark:text-emerald-600 mb-4" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/document"
                                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                            {uploading && url && (
                                <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{width: `${uploadProgress}%`}}
                                    ></div>
                                </div>
                            )}
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!url || uploading}
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-100 py-3.5 text-white dark:text-gray-900 font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed"
                            >
                                {uploading && url ? `Processing... ${uploadProgress}%` : "Process URL"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
