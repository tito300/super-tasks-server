import { Module } from '@nestjs/common';
import { ChatgptController } from './chatgpt.controller';
import { ChatgptService } from './chatgpt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ChatgptController],
  providers: [ChatgptService],
  exports: [],
})
export class ChatgptModule {}
