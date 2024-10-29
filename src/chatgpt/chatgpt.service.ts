import { Injectable } from '@nestjs/common';
import OpenAi, { OpenAI } from 'openai';
import {
  AiQuickActionsBody,
  ChatDto,
  ChatMessage,
} from './dto/update-chat.dto';
import { getChatGptMessages } from './utils/getChatGptMessages';
import { ConfigService } from '@nestjs/config';
import { constructRewritePrompt } from './utils/constructRewritePrompt';
import { constructExplainPrompt } from './utils/constructExplainPrompt';
import { constructSimplifyPrompt } from './utils/constructSimplifyPrompt';
import { constructSummarizePrompt } from './utils/constructSummarizePrompt';
import { constructPeerReviewPrompt } from './utils/constructPeerReviewPrompt';
import { AiQuickActionResponse } from './chatgpt.controller';

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
    improvements: string[],
    input: string,
    checkInaccuracies?: boolean,
  ): Promise<{
    message: {
      message: string;
      inaccuracyMessage: string;
      hasInaccuracies: boolean;
    };
  }> {
    const response = await this.openAiApi.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages: constructRewritePrompt({
        improvements,
        input,
        checkInaccuracies,
      }),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    // console.log('prompt token: ', response.usage.prompt_tokens);
    // console.log('total tokens: ', response.usage.total_tokens);
    // console.log('output tokens: ', response.usage.completion_tokens);

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return processedResponse;
  }

  async explain(body: AiQuickActionsBody): Promise<AiQuickActionResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: constructExplainPrompt(body),
      max_completion_tokens: 1000,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    // console.log('prompt token: ', response.usage.prompt_tokens);
    // console.log('total tokens: ', response.usage.total_tokens);
    // console.log('output tokens: ', response.usage.completion_tokens);
    console.log('response', response.choices[0].message.content);
    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return processedResponse;
  }
  async simplify(body): Promise<AiQuickActionResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: constructSimplifyPrompt(body),
      max_completion_tokens: 600,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    // console.log('prompt token: ', response.usage.prompt_tokens);
    // console.log('total tokens: ', response.usage.total_tokens);
    // console.log('output tokens: ', response.usage.completion_tokens);

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return processedResponse;
  }

  async summarize(body): Promise<AiQuickActionResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: constructSummarizePrompt(body),
      max_completion_tokens: 600,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    // console.log('prompt token: ', response.usage.prompt_tokens);
    // console.log('total tokens: ', response.usage.total_tokens);
    // console.log('output tokens: ', response.usage.completion_tokens);

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return processedResponse;
  }
  async peerReview(body): Promise<AiQuickActionResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: constructPeerReviewPrompt(body),
      max_completion_tokens: 600,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    // console.log('prompt token: ', response.usage.prompt_tokens);
    // console.log('total tokens: ', response.usage.total_tokens);
    // console.log('output tokens: ', response.usage.completion_tokens);

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return processedResponse;
  }
}

function appendFactCheckDisclaimer(inaccuracyMessage: string) {
  return `${inaccuracyMessage ? `Inaccurate. ${inaccuracyMessage}\n\n` : 'Accurate. '}Please note that AI can sometimes make mistakes.`;
}
