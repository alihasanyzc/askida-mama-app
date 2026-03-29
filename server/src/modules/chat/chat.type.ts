export type ChatRole = 'user' | 'assistant';

export type ChatHistoryItemInput = {
  role: ChatRole;
  content: string;
};

export type ChatRespondInput = {
  message: string;
  animal_type?: string | null;
  messages?: ChatHistoryItemInput[];
};

export type ChatSourceRecord = {
  type: 'product' | 'clinic' | 'bowl' | 'knowledge';
  id: string | null;
  title: string;
  snippet: string;
  score: number;
};

export type ChatRespondRecord = {
  reply: string;
  animal_type: string | null;
  used_fallback: boolean;
  model: string | null;
};
