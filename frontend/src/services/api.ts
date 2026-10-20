import axios from 'axios';
import type {
  UploadResponse,
  BuildResponse,
  StatusResponse,
  ChatRequest,
  ChatResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  async uploadDocuments(files: File[]): Promise<UploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post<UploadResponse>(
      '/api/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async buildKnowledgeBase(): Promise<BuildResponse> {
    const response = await api.post<BuildResponse>(
      '/api/knowledge-base/build'
    );
    return response.data;
  },

  async getKnowledgeBaseStatus(): Promise<StatusResponse> {
    const response = await api.get<StatusResponse>(
      '/api/knowledge-base/status'
    );
    return response.data;
  },

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/api/chat', request);
    return response.data;
  },

  async clearChat(sessionId: string): Promise<void> {
    await api.delete(`/api/chat/${sessionId}`);
  },
};
