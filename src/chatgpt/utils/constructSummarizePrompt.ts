import OpenAI from 'openai';
import {
  commonPromptCommand,
  factCheckCommand,
  KeepShortCommand,
} from './constructExplainPrompt';
import { AiQuickActionsBody } from '../dto/update-chat.dto';

export function constructSummarizePrompt({
  text,
  aiOptions,
}: AiQuickActionsBody): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are an AI assistant. Your task is to take the following text and summarize it.
        Make sure it the summary is written from the same perspective as the original text.
        Make sure the summary is concise and easy to read. 
        ${aiOptions.factCheck ? factCheckCommand : ''}
         ${aiOptions.keepShort ? KeepShortCommand : ''}
        ${commonPromptCommand}    
            
            Text to summarize: "${text}"`,
    },
  ];
}
