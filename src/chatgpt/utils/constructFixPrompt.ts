import OpenAI from 'openai';
import {
  commonPromptCommand,
  factCheckCommand,
  KeepShortCommand,
} from './constructExplainPrompt';
import { AiQuickActionsBody } from '../dto/update-chat.dto';

export function constructFixPrompt({
  text,
  aiOptions,
}: AiQuickActionsBody): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are an AI assistant. Your task is to take the following text and fix the problems it contains. 
      For instance, if it's an error, suggest a fix. Do not rewrite the text itself, but rather fix the problems the user is facing.
        ${aiOptions.factCheck ? factCheckCommand : ''}
        ${aiOptions.keepShort ? KeepShortCommand : ''}
        ${commonPromptCommand}    
            
            User's Problem: "${text}"`,
    },
  ];
}
