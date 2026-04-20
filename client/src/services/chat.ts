import api, { type ApiSuccessResponse } from './api';

export type ChatResponsePayload = {
  reply?: string;
};

export async function sendChatMessage(payload: {
  message: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}) {
  const response = (await api.post<ApiSuccessResponse<ChatResponsePayload>>('/chat/respond', payload, {
    timeout: 30000,
  })) as unknown as ApiSuccessResponse<ChatResponsePayload>;

  return response.data;
}
