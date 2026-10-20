import { FileText, Plus, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { DocumentInfo } from '../../types';

interface SidebarProps {
  documents: DocumentInfo[];
  knowledgeBaseReady: boolean;
  onNewConversation: () => void;
  onClearChat: () => void;
}

export function Sidebar({
  documents,
  knowledgeBaseReady,
  onNewConversation,
  onClearChat,
}: SidebarProps) {
  const getStatusIcon = () => {
    if (knowledgeBaseReady) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (documents.length > 0) {
      return <Clock className="w-4 h-4 text-accent" />;
    }
    return <XCircle className="w-4 h-4 text-muted" />;
  };

  const getStatusText = () => {
    if (knowledgeBaseReady) return 'Ready';
    if (documents.length > 0) return 'Pending build';
    return 'No documents';
  };

  return (
    <aside className="w-64 border-r border-border bg-background h-screen flex flex-col">
      <div className="p-4 border-b border-custom-border">
        <h1 className="text-lg font-semibold text-charcoal tracking-tight">
          Support Copilot
        </h1>
      </div>

      <div className="p-4 border-b border-custom-border">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-100 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="mb-4">
          <h2 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Knowledge Base
          </h2>
          <div className="flex items-center gap-2 text-sm mb-3">
            {getStatusIcon()}
            <span className="text-charcoal">{getStatusText()}</span>
          </div>
        </div>

        {documents.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Documents ({documents.length})
            </h2>
            <div className="space-y-1">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-charcoal rounded hover:bg-gray-100"
                >
                  <FileText className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-custom-border">
        <button
          onClick={onClearChat}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear chat
        </button>
      </div>
    </aside>
  );
}
