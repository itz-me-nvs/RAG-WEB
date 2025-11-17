'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHistory, FaFileAlt, FaTrash, FaClock, FaPlus, FaComments } from 'react-icons/fa';
import { getAllSessions, deleteSession, ChatSession } from '@/lib/chatHistory';

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = getAllSessions();
    setSessions(allSessions);
    setLoading(false);
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
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
                <FaHistory className="text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Chat History
                </h1>
                <p className="text-gray-600 text-lg">
                  {sessions.length === 0
                    ? 'No conversations yet'
                    : `${sessions.length} saved conversation${sessions.length !== 1 ? 's' : ''}`}
                </p>
              </div>
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

        {/* Chat History Grid/List */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 shadow-lg">
              <FaComments className="text-5xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Start your first conversation with the RAG Assistant. Your chat history will appear here.
            </p>
            <button
              onClick={handleNewChat}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
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
                    title="Delete chat"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>

                {/* Card Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {session.title || 'Untitled Conversation'}
                </h3>

                {/* Message Preview */}
                {session.messages.length > 0 && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {session.messages[session.messages.length - 1]?.text || 'No messages yet'}
                  </p>
                )}

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <FaClock className="text-blue-500" />
                    <span>{formatDate(session.updatedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaComments className="text-indigo-500" />
                    <span>{session.messages.length} messages</span>
                  </div>
                </div>

                {/* Hover Gradient Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section (if there are sessions) */}
        {sessions.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <FaComments className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                  <p className="text-sm text-gray-600">Total Conversations</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <FaFileAlt className="text-indigo-600 text-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {sessions.reduce((sum, s) => sum + s.messages.length, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Messages</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <FaClock className="text-purple-600 text-lg" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {sessions.length > 0 ? formatDate(sessions[0].updatedAt) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Last Activity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
