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

  @Post('/rewrite')
  async suggestRewrite(
    @Body()
    body: {
      improvements: string[];
      input: string;
      checkInaccuracies?: boolean;
    },
  ): ReturnType<ChatgptService['suggestRewrite']> {
    const response = await this.chatGptService.suggestRewrite(
      body.improvements,
      body.input,
      body.checkInaccuracies,
    );

    return response;
  }

  @Post('/explain')
  async explain(
    @Body()
    body: {
      text: string;
    },
  ): ReturnType<ChatgptService['suggestRewrite']> {
    const response = await this.chatGptService.explain(body.text);

    return response;
  }

  @Post('/simplify')
  async simplify(
    @Body()
    body: {
      text: string;
    },
  ): ReturnType<ChatgptService['simplify']> {
    const response = await this.chatGptService.simplify(body.text);

    return response;
  }

  @Post('/summarize')
  async summarize(
    @Body()
    body: {
      text: string;
    },
  ): ReturnType<ChatgptService['summarize']> {
    const response = await this.chatGptService.summarize(body.text);

    return response;
  }
}
