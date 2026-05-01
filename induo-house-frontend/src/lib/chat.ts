import { api } from './api';
import { ChatResponse, ChatStatus } from '@/types';

export function getChatStatus() {
  return api<ChatStatus>('/chat/status');
}

export function sendChatMessage(message: string, sessionId?: string) {
  return api<ChatResponse>('/chat/message', {
    method: 'POST',
    json: { message, sessionId },
  });
}
