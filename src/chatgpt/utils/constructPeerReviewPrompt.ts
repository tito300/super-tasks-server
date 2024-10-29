import OpenAI from 'openai';
import {
  commonPromptCommand,
  factCheckCommand,
  KeepShortCommand,
} from './constructExplainPrompt';
import { AiQuickActionsBody } from '../dto/update-chat.dto';

export function constructPeerReviewPrompt({
  text,
  aiOptions,
}: AiQuickActionsBody): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are an AI assistant. Your task is to take the following text and Peer review it as an expert on the topic.
        Do not peer review the grammar or spelling. Instead, focus on the accuracy and credibility of the information.
        If the claim made in the text has nuances or could cause issues, point them out.
        ${aiOptions.factCheck ? factCheckCommand : ''}
        ${aiOptions.keepShort ? KeepShortCommand : ''}
        ${commonPromptCommand}    
            
            Text to Peer Review: "${text}"`,
    },
  ];
}
