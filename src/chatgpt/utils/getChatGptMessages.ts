import {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';
import { ChatMessage } from '../dto/update-chat.dto';

export function getChatGptMessages(
  messages: ChatMessage[],
): ChatCompletionMessageParam[] {
  const mappedMessages = messages.map((message) => {
    return {
      role:
        message.direction === 'inbound'
          ? ('assistant' as const)
          : ('user' as const),
      content: message.message,
    };
  });

  return [
    {
      role: 'assistant',
      content:
        "Take the following user's message and give them a concise response unless they specifically asked for some kind of clarification",
    },
    ...mappedMessages,
  ];
}
