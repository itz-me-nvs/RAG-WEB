'use client';

import CitationExporter from '@/components/CitationExporter';
import DocumentGenerationControls from '@/components/DocumentGenerationControls';
import GeneratedDocumentCard from '@/components/GeneratedDocumentCard';
import QuestionTemplatesLibrary from '@/components/QuestionTemplatesLibrary';
import {
    ChatMessage,
    SourceReference,
    getSession,
    saveSession,
    updateSession
} from '@/lib/chatHistory';
import { API_BASE_URL } from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import {
    FiBook,
    FiFileText,
    FiLink,
    FiMessageSquare,
    FiPaperclip,
    FiPlus,
    FiRefreshCw,
    FiSend,
    FiUploadCloud,
    FiX
} from 'react-icons/fi';

function ChatContent() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showQuestionTemplates, setShowQuestionTemplates] = useState(false);
  const [showCitationExporter, setShowCitationExporter] = useState(false);
  const [currentSources, setCurrentSources] = useState<SourceReference[]>([]);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // PDF Viewer State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      const session = getSession(sessionParam);
      if (session) {
        setSessionId(session.id);
        setMessages(session.messages);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadedFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPdfUrl(objectUrl);
    setShowPdfViewer(true);

    // Simulate upload process
    setUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      clearInterval(interval);
      setUploadProgress(100);

      if (data.response && data.response.request_id) {
        localStorage.setItem('request_id', data.response.request_id);

        // Add system message
        const systemMsg: ChatMessage = {
          type: 'bot',
          text: `Document "${file.name}" uploaded successfully. You can now ask questions about it.`
        };

        setMessages([systemMsg]);

        // Create new session
        const newSession = saveSession(data.response.request_id, [systemMsg]);
        setSessionId(newSession.id);
        router.push(`/dashboard/chat?session=${newSession.id}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleUrlSubmit = async () => {
    if (!url) return;

    setUploading(true);
    // Simulate processing
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const response = await fetch(`${API_BASE_URL}/api/load-from-web`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      clearInterval(interval);
      setUploadProgress(100);

      if (data.response && data.response.request_id) {
        localStorage.setItem('request_id', data.response.request_id);

        const systemMsg: ChatMessage = {
          type: 'bot',
          text: `Content from "${url}" processed successfully. You can now ask questions about it.`
        };

        setMessages([systemMsg]);

        const newSession = saveSession(data.response.request_id, [systemMsg]);
        setSessionId(newSession.id);
        router.push(`/dashboard/chat?session=${newSession.id}`);
      }
    } catch (error) {
      console.error('URL processing failed:', error);
      alert('Failed to process URL');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { type: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const requestId = localStorage.getItem('request_id');
    if (!requestId) {
      alert('Please upload a document first');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/custom-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          request_id: requestId,
        }),
      });

      const data = await response.json();

      let sources: SourceReference[] = [];
      if (data.response.sources) {
        sources = data.response.sources;
      } else if (data.response.context) {
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
      }

      const botMsg: ChatMessage = {
        type: 'bot',
        text: data.response.answer,
        sources: sources
      };

      const updatedMessages = [...newMessages, botMsg];
      setMessages(updatedMessages);

      if (sessionId) {
        updateSession(sessionId, updatedMessages);
      }
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMsg: ChatMessage = { type: 'bot', text: 'Sorry, I encountered an error answering your question.' };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceClick = (source: SourceReference) => {
    if (source.pageNumber && showPdfViewer) {
      setCurrentPage(source.pageNumber);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setPdfUrl(null);
    setShowPdfViewer(false);
    setUploadedFileName(null);
    localStorage.removeItem('request_id');
    router.push('/dashboard/chat');
  };

  const handleGenerateDocument = async (type: 'pdf' | 'slides') => {
    setIsGeneratingDoc(true);
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const docTitle = type === 'pdf' ? 'Conversation Summary' : 'Key Insights Presentation';
    const docMsg: ChatMessage = {
      type: 'bot',
      text: `I've generated a ${type === 'pdf' ? 'PDF document' : 'presentation'} based on our conversation.`,
      generatedDocument: {
        type: type === 'pdf' ? 'pdf' : 'slider',
        title: docTitle,
        description: 'Automatically generated from conversation history',
        pageCount: type === 'pdf' ? 3 : 5,
        url: '#' // Mock URL
      }
    };

    const updatedMessages = [...messages, docMsg];
    setMessages(updatedMessages);
    if (sessionId) updateSession(sessionId, updatedMessages);

    setIsGeneratingDoc(false);
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
            <FiMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
              {uploadedFileName || 'New Conversation'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DocumentGenerationControls
            onGeneratePDF={() => handleGenerateDocument('pdf')}
            onGenerateSlides={() => handleGenerateDocument('slides')}
            disabled={messages.length === 0}
            isGenerating={isGeneratingDoc}
          />
          <button
            onClick={handleNewChat}
            className="modern-button-secondary p-2.5"
            title="New Chat"
          >
            <FiPlus className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Chat Area */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${showPdfViewer ? 'w-1/2' : 'w-full'}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-8 animate-fadeIn max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
                  <FiUploadCloud className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Upload a Document
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Upload a PDF or enter a URL to start analyzing content with AI-powered insights.
                </p>

                <div className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="flex border-b border-gray-200 dark:border-gray-800">
                    <button
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'upload'
                          ? 'bg-gray-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveTab('upload')}
                    >
                      Upload File
                    </button>
                    <button
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'url'
                          ? 'bg-gray-50 dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveTab('url')}
                    >
                      Enter URL
                    </button>
                  </div>

                  <div className="p-8 min-h-[250px] flex flex-col">
                    {activeTab === 'upload' ? (
                      <div
                        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all ${
                          dragActive
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-8"
                        >
                          <FiUploadCloud className={`h-12 w-12 mb-4 transition-colors ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                          <span className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Click to upload or drag
                          </span>
                          <span className="text-sm text-gray-500">
                            PDF files only (max 10MB)
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex flex-col flex-grow-[1] justify-center">
                            <div className="relative">
                                <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/document"
                                    className="modern-input pl-12"
                                />
                            </div>
                            <button
                                onClick={handleUrlSubmit}
                                disabled={!url || uploading}
                                className="modern-button-primary mt-4 w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-slideUp ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${message.type === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary-600 text-white'}
                    `}>
                      {message.type === 'user' ? (
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">YOU</span>
                      ) : (
                        <FaRobot className="h-4 w-4" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-[85%] space-y-2 ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`
                        prose prose-sm max-w-none dark:prose-invert
                        ${message.type === 'user'
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tr-none px-5 py-3 inline-block text-left'
                          : 'text-gray-900 dark:text-gray-100'
                        }
                      `}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      </div>

                      {/* Sources Section */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <FiBook className="inline" /> Sources
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSourceClick(source)}
                                className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1.5 border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                              >
                                <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-[10px] font-bold">
                                  {idx + 1}
                                </span>
                                Page {source.pageNumber}
                              </button>
                            ))}
                          </div>
                          <div className="mt-2">
                             <button
                                onClick={() => {
                                  setCurrentSources(message.sources || []);
                                  setShowCitationExporter(true);
                                }}
                                className="text-xs flex items-center gap-1 font-medium text-gray-500 hover:text-primary-600 transition-colors"
                              >
                                <FiFileText size={12} /> Export Citations
                              </button>
                          </div>
                        </div>
                      )}

                      {/* Generated Document Card */}
                      {message.generatedDocument && (
                        <div className="mt-4 max-w-sm">
                          <GeneratedDocumentCard
                            type={message.generatedDocument.type}
                            title={message.generatedDocument.title}
                            description={message.generatedDocument.description}
                            pageCount={message.generatedDocument.pageCount}
                            createdAt={new Date().toLocaleDateString()}
                            onPreview={() => window.open(message.generatedDocument?.url, '_blank')}
                            onDownload={() => {}}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 animate-fadeIn">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                      <FaRobot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 h-8">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-3xl mx-auto relative">
              {/* Question Templates Button */}
              {messages.length > 0 && (
                <button
                  onClick={() => setShowQuestionTemplates(true)}
                  className="absolute -top-12 left-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-1.5"
                >
                  <FiBook size={14} />
                  Templates
                </button>
              )}

              <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-2 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all shadow-sm">
                 <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Attach file"
                >
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about your document..."
                  className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                  disabled={isLoading || messages.length === 0}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || messages.length === 0}
                  className={`p-2 rounded-xl transition-all ${
                    input.trim()
                      ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-3">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>

        {/* PDF Viewer Panel */}
        {showPdfViewer && pdfUrl && (
          <div className="w-1/2 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col shadow-xl animate-slideInRight relative z-20">
            <div className="flex items-center justify-between bg-white dark:bg-gray-950 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                <FiFileText className="text-primary-500" />
                Document Viewer
              </h3>
              <div className="flex items-center gap-2">
                 <button
                  onClick={() => setShowPdfViewer(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-all"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-hidden bg-gray-100 dark:bg-gray-900">
               <iframe
                src={pdfUrl}
                className="w-full h-full rounded-xl bg-white shadow-sm border border-gray-200 dark:border-gray-800"
                title="PDF Viewer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <QuestionTemplatesLibrary
        isOpen={showQuestionTemplates}
        onClose={() => setShowQuestionTemplates(false)}
        onSelectQuestion={(question) => setInput(question)}
      />

      {showCitationExporter && (
        <CitationExporter
          sources={currentSources.map(s => ({
            text: s.content,
            pageNumber: s.pageNumber || 0
          }))}
          documentTitle={uploadedFileName || "Document"}
          onClose={() => setShowCitationExporter(false)}
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-500">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
