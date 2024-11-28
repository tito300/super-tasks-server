import OpenAI from 'openai';
import { factCheckCommand, KeepShortCommand } from './constructExplainPrompt';
import { AiRequestBaseBody } from '../dto/update-chat.dto';

export function constructRewritePrompt({
  input,
  improvements,
  aiOptions,
}: {
  improvements: string[];
  input: string;
  aiOptions: AiRequestBaseBody['aiOptions'];
}): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const makeSuggestion = improvements.length > 0;
  return [
    {
      role: 'system',
      content: `${
        makeSuggestion
          ? `Rewrite the "user message" given the provided "improvements" combined. The output should be one message.
      While doing that do the following: 
       - Fix any grammatical errors, spelling mistakes, or awkward phrasing.  
       - If the user message contains new lines, preserve them where possible.
       - The output should only contain the rephrased message and not any additional information.
       - If the user message is a question, do not answer it. Your job is to only rephrase it based on the previous instructions.`
          : ''
      }
      ${aiOptions.factCheck && `${makeSuggestion ? '- ' : ''}${factCheckCommand}`}
      ${aiOptions.keepShort ? `- The ${KeepShortCommand}` : ''}

       Your response format needs to be a json object containing two keys: "message" and "inaccuracyMessage".
       
      
      - user message: ${input}
      - improvements: ${improvements.join(', ')}.`,
    },
  ];
}
