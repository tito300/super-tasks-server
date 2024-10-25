import { Injectable } from '@nestjs/common';
import OpenAi, { OpenAI } from 'openai';
import { ChatDto, ChatMessage } from './dto/update-chat.dto';
import { getChatGptMessages } from './utils/getChatGptMessages';
import { ConfigService } from '@nestjs/config';
import { constructRewritePrompt } from './utils/constructRewritePrompt';

@Injectable()
export class ChatgptService {
  private openAiApi: OpenAI;

  constructor(private configService: ConfigService) {
    this.openAiApi = new OpenAi({
      apiKey: configService.get('OPEN_AI_KEY'), // Ensure you have your API key in your .env file
    });
  }

  async parseTask(input: string): Promise<any> {
    try {
      const completion = await this.openAiApi.chat.completions.create({
        model: 'gpt-3.5-turbo', // Adjust for the latest model or the one that suits your needs
        messages: this.generatePrompt(input),
        temperature: 0.4,
        max_tokens: 150,
        response_format: { type: 'json_object' },
      });

      console.log(completion.choices[0].message);
      // Transform the OpenAI response into your desired structure
      //   const parsedTask = this.transformResponse(completion.data.choices[0].text.trim());
      //   return parsedTask;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      // throw new Error('Failed to parse task with OpenAI');
    }
  }

  private generatePrompt(
    input: string,
  ): OpenAi.Chat.Completions.ChatCompletionMessageParam[] {
    // Customize this method to refine the prompt based on your requirements
    return [
      {
        role: 'user',
        content: `Given a task description, break it down into a json formatted object containing:  
    taskDetails: task details (excluding time to perform)
    timeToPerform: time to perform in human readable format
    timeToRemind: if user specified a time to remind specify it in a human readable format
    priority: give the task a priority based on its it severity, priorities range from, low to medium to high. 
    
    Task: "${input}"`,
      },
    ];
  }

  private transformResponse(response: string): any {
    // Implement parsing logic based on the expected response format
    // This example requires custom implementation
    return {};
  }

  async generateMessageResponse(
    messages: ChatMessage[],
    model: ChatDto['model'],
  ): Promise<ChatMessage> {
    const response = await this.openAiApi.chat.completions.create({
      model,
      messages: getChatGptMessages(messages),
      max_completion_tokens: 1000,
      temperature: 0.3,
    });

    return {
      id: Date.now(),
      message: response.choices[0]?.message?.content,
      direction: 'inbound',
      createdAt: Date.now(),
    };
  }

  async suggestRewrite(
    tones: string[],
    input: string,
  ): Promise<{ message: string }> {
    // Implement the rewrite logic based on the tone
    const response = await this.openAiApi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: constructRewritePrompt(tones, input),
      temperature: 0.5,
    });
    return { message: response.choices[0].message.content };
  }
}
