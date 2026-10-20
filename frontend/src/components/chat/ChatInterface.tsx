import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { ChatMessage } from '../../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted">No messages yet. Start by asking a question.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
              )}
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-charcoal text-white'
                    : 'bg-white border border-gray-300 text-charcoal'
                } rounded-lg px-4 py-3`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(message.content, index)}
                    className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-charcoal transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                  <span className="text-charcoal text-sm font-medium">U</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-medium">AI</span>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-muted rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-muted rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
