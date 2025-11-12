"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiClock, FiMessageSquare, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { getAllSessions, deleteSession, ChatSession } from "@/lib/chatHistory";

export default function HistoryPage() {
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

  const handleSessionClick = (session: ChatSession) => {
    // Navigate to dashboard chat with session ID as query parameter
    router.push(`/dashboard/chat?session=${session.id}`);
  };

  const handleDeleteSession = (
    e: React.MouseEvent,
    sessionId: string
  ) => {
    e.stopPropagation(); // Prevent opening the session
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteSession(sessionId);
      loadSessions();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading history...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-4"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Chat History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {sessions.length === 0
              ? "No chat history yet"
              : `${sessions.length} saved conversation${sessions.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* History List */}
        {sessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
            <FiMessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No chat history yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Your previous conversations will appear here
            </p>
            <button
              onClick={() => router.push("/dashboard/chat")}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Start a New Chat
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate group-hover:text-primary transition-colors">
                      {session.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiMessageSquare className="w-4 h-4" />
                        <span>{session.messages.length} messages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{formatDate(session.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Preview of last message */}
                    {session.messages.length > 0 && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {session.messages[session.messages.length - 1].text}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete chat"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
