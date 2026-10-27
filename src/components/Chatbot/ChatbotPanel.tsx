import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  Trash2,
  AlertTriangle,
  Copy,
  Check,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useChat } from '../../context/ChatContext.tsx';

const SUGGESTED_QUESTIONS = [
  'How can I find a doctor?',
  'Explain a medical term',
  'Help me understand a lab test',
  'Find healthcare information',
];

export const ChatbotPanel: React.FC = () => {
  const {
    messages,
    isOpen,
    isExpanded,
    isLoading,
    error,
    conversationId,
    provider,
    openChat,
    closeChat,
    toggleExpand,
    sendMessage,
    retryLastMessage,
    clearChat,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // focus input when opened on non-touch devices
      if (window.innerWidth > 768) {
        inputRef.current?.focus();
      }
    }
  }, [messages, isOpen, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    void sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-900 shadow-xl border border-teal-100 dark:border-slate-800 rounded-full py-2 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 animate-bounce duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>Ask CarePulse AI Health Assistant</span>
          </div>

          <button
            onClick={() => openChat()}
            aria-label="Open Healthcare Chatbot"
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-teal-500/30 cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="sr-only">Open Health Assistant</span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white dark:border-slate-900"></span>
            </span>
          </button>
        </div>
      )}

      {/* Chatbot Window Container */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Healthcare Assistant"
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-12 rounded-2xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] md:w-[460px] h-[100dvh] sm:h-[620px] sm:max-h-[85vh] sm:rounded-2xl'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white px-4 py-3 sm:py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-teal-200 shadow-inner">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm sm:text-base leading-tight tracking-tight">
                    CarePulse AI Assistant
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/30 text-teal-200 border border-teal-400/30">
                    {provider === 'dify' ? 'Dify AI' : 'Live Bot'}
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/80 leading-none mt-0.5">
                  General healthcare advice & service guidance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-teal-100">
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={toggleExpand}
                title={isExpanded ? 'Minimize size' : 'Expand window'}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={closeChat}
                title="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Safety Notice Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-3 py-1.5 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Medical Disclaimer:</strong> For educational purposes only. Does not replace professional clinical diagnosis. In emergencies, dial <strong>112</strong> or <strong>911</strong> immediately.
            </p>
          </div>

          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-medium shadow-sm ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-teal-600 dark:bg-teal-700 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                    }`}
                  >
                    {/* Emergency Alert indicator */}
                    {msg.isEmergencyAlert && !isUser && (
                      <div className="mb-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Emergency Medical Alert Triggered</span>
                      </div>
                    )}

                    {/* Formatted Content */}
                    <div className="space-y-1.5 whitespace-pre-wrap leading-relaxed text-[13.5px]">
                      {msg.text}
                    </div>

                    {/* Metadata & Actions */}
                    <div
                      className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                        isUser
                          ? 'border-blue-500/40 text-blue-100'
                          : 'border-slate-100 dark:border-slate-700/60 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium">
                    Consulting medical knowledge
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message with Retry */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-200 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Unable to process message</p>
                    <p className="text-red-700/80 dark:text-red-300/80 mt-0.5">{error}</p>
                  </div>
                </div>
                <button
                  onClick={retryLastMessage}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-3 pt-2 pb-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" />
                Suggested:
              </span>
              {SUGGESTED_QUESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => void sendMessage(suggestion)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800 dark:hover:bg-teal-950/60 dark:hover:text-teal-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about symptoms, medical terms, doctors, or tests..."
                rows={1}
                className="w-full pl-3.5 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                style={{ minHeight: '42px', maxHeight: '100px' }}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-2 p-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
              <span>Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline</span>
              {conversationId && (
                <span title={`Session ID: ${conversationId}`}>
                  ID: {conversationId.substring(0, 10)}...
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};
