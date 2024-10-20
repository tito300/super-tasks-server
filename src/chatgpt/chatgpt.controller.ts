import { Body, Controller, Post } from '@nestjs/common';
import { ChatDto, ChatMessage } from './dto/update-chat.dto';
import { ChatgptService } from './chatgpt.service';

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
}
