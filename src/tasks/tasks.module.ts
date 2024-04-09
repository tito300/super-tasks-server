import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, ChatgptService],
})
export class TasksModule {}
