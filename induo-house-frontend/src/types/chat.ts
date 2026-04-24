export interface ChatStatus {
  enabled: boolean;
  ragEnabled: boolean;
  modelConfigured: boolean;
  assistantName: string;
  model: string;
  message: string;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

export interface ChatResponse {
  sessionId: string;
  answer: string;
}
