import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  AiQuickActionsBody,
  ChatDto,
  ChatMessage,
} from './dto/update-chat.dto';
import { ChatgptService } from './chatgpt.service';
import { AuthGuard } from 'src/auth/auth.guard';

export type AiQuickActionResponse = {
  message: string;
  hasInaccuracies: boolean;
  inaccuracyMessage: string;
};

@Controller('api/ai')
export class ChatgptController {
  constructor(private readonly chatGptService: ChatgptService) {}

  @UseGuards(AuthGuard)
  @Post('/chat')
  async generateMessage(@Body() body: ChatDto): Promise<ChatMessage> {
    const response = await this.chatGptService.generateMessageResponse(
      body.messages,
      body.model,
      body.aiOptions,
    );

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/rewrite')
  async suggestRewrite(
    @Body()
    body: {
      improvements: string[];
      input: string;
      checkInaccuracies?: boolean;
      keepShort?: boolean;
    },
  ): ReturnType<ChatgptService['suggestRewrite']> {
    const response = await this.chatGptService.suggestRewrite(
      body.improvements,
      body.input,
      body.checkInaccuracies,
      body.keepShort,
    );

    return response;
  }

  @UseGuards(AuthGuard)
  @Post('/quick-action')
  async explain(
    @Body()
    body: AiQuickActionsBody,
  ): Promise<AiQuickActionResponse> {
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
    const response = await this.chatGptService[serviceMethod](body);

    return response;
  }
}
