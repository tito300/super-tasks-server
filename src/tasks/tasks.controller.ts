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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('/api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  async getTaskList(@Req() request: Request) {
    return this.tasksService.listTaskList(
      request.headers['content-oauth'] as string,
    );
  }

  @Get(':tasklistId/tasks')
  async getTasks(
    @Param('tasklistId') tasklistId: string,
    @Req() request: Request,
  ) {
    return this.tasksService.listTasks(
      tasklistId,
      request.headers['content-oauth'] as string,
    );
  }

  @Delete(':tasklistId/tasks/:taskId')
  async deleteTask(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.deleteTask(
      tasklistId,
      taskId,
      request.headers['content-oauth'] as string,
    );
  }

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
      request.headers['content-oauth'] as string,
    );
  }

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
      request.headers['content-oauth'] as string,
    );
  }

  @Post(':tasklistId/tasks')
  async createTask(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Body() task: CreateTaskDto,
    @Query('previous') previousTaskId: string,
  ) {
    console.log(task)
    return this.tasksService.createTask(
      tasklistId,
      task,
      previousTaskId,
      request.headers['content-oauth'] as string,
    );
  }

  @Post('')
  async createTasksList(
    @Req() request: Request,
    @Param('tasklistId') tasklistId: string,
    @Body() task: CreateTaskDto,
  ) {
    return this.tasksService.createTasksList();
  }
}
