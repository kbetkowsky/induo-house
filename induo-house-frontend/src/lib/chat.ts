import { apiClient } from './api';
import { ChatMessage, ChatResponse, ChatSessionSummary, ChatStatus } from '@/types/chat';

export async function getChatStatus(): Promise<ChatStatus> {
  const response = await apiClient.get<ChatStatus>('/chat/status');
  return response.data;
}

export async function getChatSessions(): Promise<ChatSessionSummary[]> {
  const response = await apiClient.get<ChatSessionSummary[]>('/chat/sessions');
  return response.data;
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const response = await apiClient.get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`);
  return response.data;
}

export async function sendChatMessage(message: string, sessionId?: string | null): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>('/chat/message', {
    sessionId: sessionId ?? null,
    message,
  });
  return response.data;
}
