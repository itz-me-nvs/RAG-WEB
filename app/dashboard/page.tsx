'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileAlt, FaTrash, FaClock, FaPlus } from 'react-icons/fa';
import { getAllSessions, deleteSession, ChatSession } from '@/lib/chatHistory';

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

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat session?')) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600 text-lg">
                Continue your conversations or start a new one
              </p>
            </div>
            <button
              onClick={handleNewChat}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              <FaPlus />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Chat History Grid */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
              <FaFileAlt className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6">Start a new chat to begin</p>
            <button
              onClick={handleNewChat}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 transition-transform"
            >
              Start Your First Chat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <FaFileAlt className="text-xl text-blue-600" />
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>

                {/* Card Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {session.title || 'Untitled Conversation'}
                </h3>

                {/* Message Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {session.messages[session.messages.length - 1]?.text || 'No messages yet'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>{formatDate(session.updatedAt)}</span>
                  </div>
                  <span>{session.messages.length} messages</span>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
