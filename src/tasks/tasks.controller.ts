import {
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Body,
  Req,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/api/taskLists')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getTaskList(@Req() request: Request) {
    return this.tasksService.listTaskList(request.user.googleAccessToken);
  }

  @UseGuards(AuthGuard)
  @Get(':tasklistId/tasks')
  async getTasks(
    @Param('tasklistId') tasklistId: string,
    @Req() request: Request,
  ) {
    return this.tasksService.listTasks(
      tasklistId,
      request.user.googleAccessToken,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':tasklistId/tasks/:taskId')
  async deleteTask(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.deleteTask(
      tasklistId,
      taskId,
      request.user.googleAccessToken,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':tasklistId/tasks/:taskId/move')
  async moveTask(
    @Param('tasklistId') tasklistId: string,
    @Param('taskId') taskId: string,
    @Body('previousTaskId') previousTaskId: string | undefined,
    @Req() request: Request,
  ) {
    return this.tasksService.moveTask(
      tasklistId,
      taskId,
      previousTaskId,
      request.user.googleAccessToken,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':tasklistId/tasks/:taskId')
  async updateTask(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Param('taskId') taskId: string,
    @Body() task: any,
  ) {
    return this.tasksService.updateTask(
      tasklistId,
      task,
      request.user.googleAccessToken,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':tasklistId/tasks')
  async createTask(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Body() task: CreateTaskDto,
    @Query('previous') previousTaskId: string,
  ) {
    console.log(task);
    return this.tasksService.createTask(
      tasklistId,
      task,
      previousTaskId,
      request.user.googleAccessToken,
    );
  }

  @UseGuards(AuthGuard)
  @Post('')
  async createTasksList(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Body() task: CreateTaskDto,
  ) {
    return this.tasksService.createTasksList();
  }
}
