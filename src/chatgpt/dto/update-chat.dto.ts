export type ChatMessage = {
  id: number;
  message: string;
  direction: 'outbound' | 'inbound';
  createdAt: number;
};

export class ChatDto {
  messages: ChatMessage[];
  model: 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4o';
}

export type AiQuickActionsBody = {
  text: string;
  action: 'Summarize' | 'Explain' | 'Simplify' | 'PeerReview';
  aiOptions?: {
    keepShort?: boolean;
    factCheck?: boolean;
  };
};
