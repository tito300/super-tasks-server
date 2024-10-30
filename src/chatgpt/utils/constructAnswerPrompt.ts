import OpenAI from 'openai';
import {
  commonPromptCommand,
  factCheckCommand,
  KeepShortCommand,
} from './constructExplainPrompt';
import { AiQuickActionsBody } from '../dto/update-chat.dto';

export function constructAnswerPrompt({
  text,
  aiOptions,
}: AiQuickActionsBody): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are an AI assistant. Your task is to take the following question \
      and answer it using data that is not outdated.
        ${aiOptions.factCheck ? factCheckCommand : ''}
        ${aiOptions.keepShort ? KeepShortCommand : ''}
        ${commonPromptCommand}    
            
            Question to answer: "${text}"`,
    },
  ];
}
