import { Body, Controller, Post } from '@nestjs/common';
import {
  AiQuickActionsBody,
  ChatDto,
  ChatMessage,
} from './dto/update-chat.dto';
import { ChatgptService } from './chatgpt.service';

export type AiQuickActionResponse = {
  message: string;
  hasInaccuracies: boolean;
  inaccuracyMessage: string;
};

@Controller('api/ai')
export class ChatgptController {
  constructor(private readonly chatGptService: ChatgptService) {}

  @Post('/chat')
  async generateMessage(@Body() body: ChatDto): Promise<ChatMessage> {
    const response = await this.chatGptService.generateMessageResponse(
      body.messages,
      body.model,
    );

    return response;
  }

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
        break;
    }
    const response = await this.chatGptService[serviceMethod](body);

    return response;
  }
}
