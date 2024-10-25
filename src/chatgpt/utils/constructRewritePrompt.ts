import OpenAI from 'openai';

export function constructRewritePrompt(
  tones: string[],
  input: string,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `Rewrite the user input given the provided tones below. The output should be one message that uses all tones at the same time when possible. 
      Keep the message relatively the same length unless the tone explicitly asks for a longer or shorter message. 
      If user input contains html, keep the html formatting similar to original message.
      If you encounter signatures or headers, leave them as is and in the same positions relative to the message.
      The output should only contain the message content, not the user input or any other information.

        user input: "${input}"
        tones: ${tones.join(', ')}`,
    },
  ];
}
