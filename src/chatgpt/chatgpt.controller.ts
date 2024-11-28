import {
  Body,
  Controller,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AiQuickActionsBody,
  AiRequestBaseBody,
  ChatDto,
  ChatMessage,
} from './dto/update-chat.dto';
import { ChatgptService, QuickActionServiceResponse } from './chatgpt.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { TokenGuard } from './tokenGuard';
import { JWTUser } from 'src/auth/types';

export type AiQuickActionResponse = {
  message: string;
  hasInaccuracies: boolean;
  inaccuracyMessage: string;
  limitReached?: boolean;
};

export const premiumModels: ChatCompletionCreateParamsBase['model'][] = [
  'chatgpt-4o-latest',
];

@Controller('api/ai')
export class ChatgptController {
  constructor(
    private readonly chatGptService: ChatgptService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard, TokenGuard)
  @Post('/chat')
  async generateMessage(
    @Body() body: ChatDto,
    @Req() req: Request,
  ): Promise<ChatMessage> {
    if (req['aiLimitReached']) {
      body.aiOptions.model = 'gpt-4o-mini';
    }

    const { response, totalUsage } =
      await this.chatGptService.generateMessageResponse(
        body.messages,
        body.aiOptions,
      );

    this.updateTodayAiUsage(req.user, body.aiOptions?.model, totalUsage);

    // @ts-expect-error
    response.limitReached = req['aiLimitReached'];

    return response;
  }

  @UseGuards(AuthGuard, TokenGuard)
  @Post('/rewrite')
  async suggestRewrite(
    @Body()
    body: {
      improvements: string[];
      input: string;
      aiOptions: AiRequestBaseBody['aiOptions'];
    },
    @Req() req: Request,
  ): Promise<
    Awaited<ReturnType<ChatgptService['suggestRewrite']>>['response']
  > {
    const limitReached = req['aiLimitReached'];

    if (limitReached) {
      body.aiOptions.model = 'gpt-4o-mini';
    }

    const { response, totalUsage } =
      await this.chatGptService.suggestRewrite(body);

    this.updateTodayAiUsage(req.user, body.aiOptions.model, totalUsage);

    response.limitReached = limitReached;
    console.log('!!!!!!!!!!!!!! response', response);

    return response;
  }

  @UseGuards(AuthGuard, TokenGuard)
  @Post('/quick-action')
  async explain(
    @Body()
    body: AiQuickActionsBody,
    @Req() req: Request,
  ): Promise<QuickActionServiceResponse['response']> {
    let serviceMethod: keyof ChatgptService;
    switch (body.action) {
      case 'Summarize':
        serviceMethod = 'summarize';
        break;
      case 'Explain':
        serviceMethod = 'explain';
        break;
      case 'Simplify':
        serviceMethod = 'simplify';
        break;
      case 'PeerReview':
        serviceMethod = 'peerReview';
        break;
      case 'Answer':
        serviceMethod = 'answer';
      case 'FactCheck':
        serviceMethod = 'factCheck';
        break;
    }
    const limitReached = req['aiLimitReached'];

    if (limitReached) {
      body.aiOptions.model = 'gpt-4o-mini';
    }

    const { response, totalUsage } =
      await this.chatGptService[serviceMethod](body);

    this.updateTodayAiUsage(req.user, body.aiOptions.model, totalUsage);
    response.limitReached = limitReached;

    return response;
  }

  async updateTodayAiUsage(
    user: JWTUser,
    model: AiRequestBaseBody['aiOptions']['model'],
    totalUsage: number,
  ) {
    if (premiumModels.includes(model)) {
      try {
        await this.userService.updateTodayAiUsage(user.id, totalUsage);
      } catch (error) {
        console.error('Error updating today ai usage', error);
      }
    }
  }
}
