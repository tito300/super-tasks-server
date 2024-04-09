import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'supertasks',
      entities: [],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, ChatgptService],
})
export class AppModule {}
