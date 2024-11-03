import OpenAI from 'openai';
import {
  commonPromptCommand,
  factCheckCommand,
  KeepShortCommand,
} from './constructExplainPrompt';
import { AiQuickActionsBody } from '../dto/update-chat.dto';

export function constructFactCheckPrompt({
  text,
  aiOptions,
}: AiQuickActionsBody): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `fact check the claim stated below and provide a response based on the most recent data available. 
      If the claim is inaccurate, provide a response that corrects the inaccuracies in the "message" key.
      If the claim is accurate, Point out the accurate information and keep it short.
      If the claim is religious or political, provide both sides of the argument.
        ${aiOptions.keepShort ? KeepShortCommand : ''}
        ${commonPromptCommand}    
            
            Claim to fact check: "${text}"`,
    },
  ];
}
