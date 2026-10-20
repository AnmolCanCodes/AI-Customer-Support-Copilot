export interface DocumentInfo {
  name: string;
  size: number;
}

export interface UploadResponse {
  documents: DocumentInfo[];
  count: number;
}

export interface BuildResponse {
  status: string;
  document_count: number;
  chunk_count: number;
}

export interface StatusResponse {
  ready: boolean;
  document_count?: number;
  chunk_count?: number;
}

export interface ChatRequest {
  question: string;
  session_id: string;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
}
