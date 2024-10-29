import OpenAI from 'openai';
import { factCheckCommand } from './constructExplainPrompt';

export function constructRewritePrompt({
  input,
  improvements,
  checkInaccuracies,
}: {
  improvements: string[];
  input: string;
  checkInaccuracies?: boolean;
}): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  console.log('checkInaccuracies', checkInaccuracies);
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
       - If you encounter signatures or headers, strip them out.
       - The output should only contain the message content, not the user message or any other information.
       - If the user message is a question, do not answer it. Your job is to only rephrase it based on the previous instructions.`
          : ''
      }
      ${checkInaccuracies && `${makeSuggestion ? '- ' : ''}${factCheckCommand}`}

       Your response format needs to be a json object containing two keys: "message" and "inaccuracyMessage".
       
      
      - user message: ${input}
      - improvements: ${improvements.join(', ')}.`,
    },
  ];
}
