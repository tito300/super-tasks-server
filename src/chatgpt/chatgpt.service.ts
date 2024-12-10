import { Injectable } from '@nestjs/common';
import OpenAi, { OpenAI } from 'openai';
import {
  AiQuickActionsBody,
  AiRequestBaseBody,
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
import { constructAnswerPrompt } from './utils/constructAnswerPrompt';
import { constructFactCheckPrompt } from './utils/constructFactCheckPrompt';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { constructFixPrompt } from './utils/constructFixPrompt';

export type ChatGptModel = ChatCompletionCreateParamsBase['model'];
export type QuickActionServiceResponse = {
  response: AiQuickActionResponse;
  totalUsage: number;
};

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

  async generateMessageResponse(
    messages: ChatMessage[],
    aiOptions?: ChatDto['aiOptions'],
  ): Promise<{ response: ChatMessage; totalUsage: number }> {
    const response = await this.openAiApi.chat.completions.create({
      model: aiOptions?.model || 'gpt-4o-mini',
      messages: getChatGptMessages(messages, aiOptions),
      max_completion_tokens: 1000,
      temperature: 0.3,
    });

    return {
      response: {
        id: Date.now(),
        message: response.choices[0]?.message?.content,
        direction: 'inbound',
        createdAt: Date.now(),
      },
      totalUsage: response.usage?.total_tokens || 0,
    };
  }

  async suggestRewrite({
    improvements,
    input,
    aiOptions,
  }: {
    improvements: string[];
    input: string;
    aiOptions: AiRequestBaseBody['aiOptions'];
  }): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: aiOptions?.model || 'gpt-4o-mini',
      messages: constructRewritePrompt({
        improvements,
        input,
        aiOptions,
      }),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }

  async explain(body: AiQuickActionsBody): Promise<QuickActionServiceResponse> {
    console.log('********** body', body);
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructExplainPrompt(body),
      max_completion_tokens: 2000,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });
    console.log('response', response.choices[0].message.content);
    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }
  async simplify(body): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructSimplifyPrompt(body),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }

  async summarize(body): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructSummarizePrompt(body),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }
  async peerReview(
    body: AiQuickActionsBody,
  ): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructPeerReviewPrompt(body),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }
  async answer(body: AiQuickActionsBody): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructAnswerPrompt(body),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }
  async factCheck(
    body: AiQuickActionsBody,
  ): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructFactCheckPrompt(body),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }
  async fix(body: AiQuickActionsBody): Promise<QuickActionServiceResponse> {
    const response = await this.openAiApi.chat.completions.create({
      model: body.aiOptions?.model || 'gpt-4o-mini',
      messages: constructFixPrompt(body),
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const processedResponse = {
      message: parsedResponse.message || '',
      inaccuracyMessage: appendFactCheckDisclaimer(
        parsedResponse.inaccuracyMessage,
      ),
      hasInaccuracies: !!parsedResponse.inaccuracyMessage,
    };

    return {
      response: processedResponse,
      totalUsage: response.usage?.total_tokens || 0,
    };
  }
}

function appendFactCheckDisclaimer(inaccuracyMessage: string) {
  return `${inaccuracyMessage ? `Inaccurate. ${inaccuracyMessage}\n\n` : 'Accurate. '}Please note that AI can sometimes make mistakes.`;
}
