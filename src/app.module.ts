import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { HttpModule } from '@nestjs/axios';
import { CalendarModule } from './calendar/calendar.module';
import { ChatgptController } from './chatgpt/chatgpt.controller';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'supertasks',
      entities: [],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    HttpModule,
    CalendarModule,
    ChatgptModule,
    ChatgptModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ChatgptController],
  providers: [AppService, ChatgptService],
})
export class AppModule {}
