import {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';
import { ChatDto, ChatMessage } from '../dto/update-chat.dto';

export function getChatGptMessages(
  messages: ChatMessage[],
  aiOptions?: ChatDto['aiOptions'],
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
      role: 'system',
      content: `Take the following user's messages and provide a response.
        ${aiOptions.keepShort ? 'Keep the responses short and concise.' : ''}`,
    },
    ...mappedMessages,
  ];
}
