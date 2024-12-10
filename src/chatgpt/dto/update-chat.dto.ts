import { extend } from 'dayjs';

export type ChatMessage = {
  id: number;
  message: string;
  direction: 'outbound' | 'inbound';
  createdAt: number;
};

export class AiRequestBaseBody {
  aiOptions?: {
    keepShort?: boolean;
    factCheck?: boolean;
    model: 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4o';
  };
}

export class ChatDto extends AiRequestBaseBody {
  messages: ChatMessage[];
}

export class AiQuickActionsBody extends AiRequestBaseBody {
  text: string;
  action:
    | 'Summarize'
    | 'Explain'
    | 'Simplify'
    | 'PeerReview'
    | 'Answer'
    | 'FactCheck'
    | 'Fix';
}
