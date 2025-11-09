export interface SourceReference {
  content: string;
  pageNumber?: number;
  score?: number;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  type: "user" | "bot";
  text: string;
  sources?: SourceReference[];
}

export interface ChatSession {
  id: string;
  title: string;
  requestId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "chat_history";

/**
 * Generate a unique ID for chat sessions
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a title from the first user message
 */
export function generateTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((msg) => msg.type === "user");
  if (firstUserMessage) {
    // Truncate to 50 characters
    return firstUserMessage.text.length > 50
      ? firstUserMessage.text.substring(0, 50) + "..."
      : firstUserMessage.text;
  }
  return "Untitled Chat";
}

/**
 * Get all chat sessions from localStorage
 */
export function getAllSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ChatSession[];
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
}

/**
 * Get a specific chat session by ID
 */
export function getSession(sessionId: string): ChatSession | null {
  const sessions = getAllSessions();
  return sessions.find((session) => session.id === sessionId) || null;
}

/**
 * Save a new chat session
 */
export function saveSession(
  requestId: string,
  messages: ChatMessage[]
): ChatSession {
  const sessions = getAllSessions();
  const now = new Date().toISOString();

  const newSession: ChatSession = {
    id: generateSessionId(),
    title: generateTitle(messages),
    requestId,
    messages,
    createdAt: now,
    updatedAt: now,
  };

  sessions.unshift(newSession); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

  return newSession;
}

/**
 * Update an existing chat session
 */
export function updateSession(
  sessionId: string,
  messages: ChatMessage[]
): ChatSession | null {
  const sessions = getAllSessions();
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

  if (sessionIndex === -1) return null;

  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    messages,
    title: generateTitle(messages),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return sessions[sessionIndex];
}

/**
 * Delete a chat session
 */
export function deleteSession(sessionId: string): boolean {
  const sessions = getAllSessions();
  const filtered = sessions.filter((s) => s.id !== sessionId);

  if (filtered.length === sessions.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Clear all chat history
 */
export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
