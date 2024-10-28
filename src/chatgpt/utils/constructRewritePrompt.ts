import OpenAI from 'openai';

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
          ? `Rewrite the user message given the provided improvements below. The output should be one message that uses all improvements at the same time.
      Fix any grammatical errors, spelling mistakes, or awkward phrasing. 
      Keep the message relatively the same length unless the tone explicitly asks for a longer or shorter message. 
      If user message contains html or new lines, preserve them.
      If you encounter signatures or headers, strip them out.
      The output should only contain the message content, not the user message or any other information.
      If the user message below is a question, do not answer it. Your job is to only rephrase it based on the previous instructions.`
          : ''
      }

      
      ${
        checkInaccuracies && makeSuggestion
          ? 'Your response format needs to be a json object containing two keys: message and inaccuracyMessage.'
          : checkInaccuracies
            ? 'Your response format needs to be a json object containing one key: inaccuracyMessage.'
            : 'Your response format needs to be a json object containing one key: message.'
      }
        
      ${
        checkInaccuracies &&
        "Detect the topic and the claim of the message and then as an expert on the topic, \
        fact check the claim and if it's inaccurate provide a correction that directly addresses the message claim in the inaccuracyMessage key, \
        otherwise leave it blank."
      }
      
      - user message: ${input}
      - improvements: ${improvements.join(', ')}`,
    },
  ];
}
