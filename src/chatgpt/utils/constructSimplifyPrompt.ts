import OpenAI from 'openai';
import { commonPromptCommand } from './constructExplainPrompt';

export function constructSimplifyPrompt({
  text,
}: {
  text: string;
}): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `You are an AI assistant. Your task is to take the following piece of text and simplify it to make it easier to understand. 
        ${commonPromptCommand}  
        Return the result in a json object with the key 'message'. 
          
          Text to simplify: "${text}"`,
    },
  ];
}
