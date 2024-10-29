import OpenAI from 'openai';
import {
  commonPromptCommand,
  factCheckCommand,
  KeepShortCommand,
} from './constructExplainPrompt';
import { AiQuickActionsBody } from '../dto/update-chat.dto';

export function constructSimplifyPrompt({
  text,
  aiOptions,
}: AiQuickActionsBody): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are an AI assistant. Your task is to take the following piece of text and simplify it to make it easier to understand. 
        ${aiOptions.factCheck ? factCheckCommand : ''}
         ${aiOptions.keepShort ? KeepShortCommand : ''}
        ${commonPromptCommand} 
          
          Text to simplify: "${text}"`,
    },
  ];
}
