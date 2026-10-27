import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types/index.ts';

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  provider: 'dify' | 'fallback' | 'gemini' | null;
  openChat: (initialPrompt?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleExpand: () => void;
  sendMessage: (text: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  clearChat: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: "Hi! I'm your healthcare assistant. How can I help you today?",
  timestamp: Date.now(),
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY_MESSAGES = 'carepulse_chat_messages_v1';
const STORAGE_KEY_CONV_ID = 'carepulse_chat_conv_id_v1';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Could not restore chat session:', e);
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [conversationId, setConversationId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(STORAGE_KEY_CONV_ID) || null;
    }
    return null;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'dify' | 'fallback' | 'gemini' | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  // Sync to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to sessionStorage:', e);
    }
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      sessionStorage.setItem(STORAGE_KEY_CONV_ID, conversationId);
    }
  }, [conversationId]);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError(null);
    setLastUserMessage(trimmed);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          conversationId: conversationId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      if (data.provider) {
        setProvider(data.provider);
      }

      const assistantMsg: ChatMessage = {
        id: data.message_id || `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || "I've received your inquiry. How else may I assist you?",
        timestamp: Date.now(),
        isEmergencyAlert: data.isEmergencyAlert,
        provider: data.provider,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to healthcare assistant.';
      console.error('Chat error:', err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const openChat = useCallback((initialPrompt?: string) => {
    setIsOpen(true);
    if (initialPrompt && initialPrompt.trim()) {
      setTimeout(() => {
        void handleSend(initialPrompt);
      }, 150);
    }
  }, [handleSend]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const retryLastMessage = async () => {
    if (lastUserMessage) {
      setError(null);
      await handleSend(lastUserMessage);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setConversationId(null);
    setError(null);
    setLastUserMessage(null);
    sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
    sessionStorage.removeItem(STORAGE_KEY_CONV_ID);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isExpanded,
        isLoading,
        error,
        conversationId,
        provider,
        openChat,
        closeChat,
        toggleChat,
        toggleExpand,
        sendMessage: handleSend,
        retryLastMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
