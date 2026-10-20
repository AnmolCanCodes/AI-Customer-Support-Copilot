import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ChatInterface } from './components/chat/ChatInterface';
import { ChatInput } from './components/chat/ChatInput';
import { DocumentUpload } from './components/documents/DocumentUpload';
import { BuildButton } from './components/documents/BuildButton';
import { apiService } from './services/api';
import type { DocumentInfo, ChatMessage } from './types';

function App() {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [knowledgeBaseReady, setKnowledgeBaseReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    checkKnowledgeBaseStatus();
  }, []);

  const checkKnowledgeBaseStatus = async () => {
    try {
      const status = await apiService.getKnowledgeBaseStatus();
      setKnowledgeBaseReady(status.ready);
    } catch (error) {
      console.error('Failed to check knowledge base status:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const response = await apiService.uploadDocuments(files);
      setDocuments(response.documents);
      setKnowledgeBaseReady(false);
      setMessages([]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    try {
      await apiService.buildKnowledgeBase();
      setKnowledgeBaseReady(true);
      setMessages([]);
    } catch (error) {
      console.error('Build failed:', error);
      alert('Failed to build knowledge base. Please try again.');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!knowledgeBaseReady) {
      alert('Please upload documents and build the knowledge base first.');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiService.chat({
        question: message,
        session_id: sessionId,
      });
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat failed:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
  };

  const handleClearChat = async () => {
    try {
      await apiService.clearChat(sessionId);
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        documents={documents}
        knowledgeBaseReady={knowledgeBaseReady}
        onNewConversation={handleNewConversation}
        onClearChat={handleClearChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {!knowledgeBaseReady ? (
            <div className="h-full overflow-y-auto scrollbar-thin">
              <div className="max-w-3xl mx-auto py-12 px-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-charcoal mb-2">
                    Document-based Question Answering
                  </h2>
                  <p className="text-muted">
                    Upload your PDF or TXT documents to create a knowledge base,
                    then ask questions that will be answered using only the
                    information in your files.
                  </p>
                </div>

                <DocumentUpload onUpload={handleUpload} isUploading={isUploading} />

                {documents.length > 0 && (
                  <div className="mt-6">
                    <BuildButton
                      hasDocuments={documents.length > 0}
                      isBuilding={isBuilding}
                      onBuild={handleBuild}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ChatInterface messages={messages} isLoading={isLoading} />
          )}
        </div>

        {knowledgeBaseReady && (
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        )}
      </div>
    </div>
  );
}

export default App;
