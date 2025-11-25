'use client';

import { ChatSession, deleteSession, getAllSessions } from '@/lib/chatHistory';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiClock, FiPlus, FiTrash2, FiZap } from 'react-icons/fi';

export default function DashboardHome() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = getAllSessions();
    setSessions(allSessions);
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/dashboard/chat?session=${sessionId}`);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
      loadSessions();
    }
  };

  const handleNewChat = () => {
    router.push('/dashboard/chat');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const suggestedPrompts = [
    "Summarize this document",
    "What are the key findings?",
    "Explain the methodology",
    "List the main arguments"
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <header className="mb-16 text-center animate-fadeIn pt-10">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
            <FiZap size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Welcome to RAG Web
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your documents and ask questions to get instant, AI-powered insights.
          </p>
        </header>

        {/* Suggested Prompts */}
        {sessions.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 animate-slideUp">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={handleNewChat}
                className="modern-card p-4 text-left hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md transition-all group"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {prompt}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-500">Start chat →</span>
              </button>
            ))}
          </div>
        )}

        {/* Recent Sessions */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FiClock className="text-gray-400" />
            Recent Activity
          </h2>
          <button
            onClick={handleNewChat}
            className="modern-button-primary flex items-center gap-2 text-sm"
          >
            <FiPlus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No recent conversations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="modern-card p-5 cursor-pointer group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
                    {session.title ? session.title.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete session"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {session.title || 'Untitled Chat'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                  {session.messages[session.messages.length - 1]?.text || 'No messages yet...'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs text-gray-400">
                    {formatDate(session.updatedAt)}
                  </span>
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Open <FiArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
