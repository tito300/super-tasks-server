import { HttpException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { ChatgptService } from 'src/chatgpt/chatgpt.service';

@Injectable()
export class TasksService {
  private tasks = google.tasks('v1');

  constructor(private chatgptService: ChatgptService) {}

  async listTaskList(token: string): Promise<Task[]> {
    try {
      const response = await this.tasks.tasklists.list({
        oauth_token: token,
      });
      return response.data as Task[]; // This returns the tasks in the specified task list
    } catch (error) {
      if (error.status === 401) {
        throw new HttpException('Invalid token', 401);
      }

      throw new Error('Failed to list tasks: ' + error.message);
    }
  }

  async listTasks(tasklistId: string, token: string): Promise<{items: Task[]}> {
    try {
      const response = await this.tasks.tasks.list({
        oauth_token: token,
        tasklist: tasklistId,
      });
      return response.data as {items: Task[]}; // This returns the tasks in the specified task list
    } catch (error) {
      if (error.status === 401) {
        throw new HttpException('Invalid token', 401);
      }
      throw new Error('Failed to list tasks: ' + error.message);
    }
  }

  async deleteTask(
    tasklistId: string,
    taskId: string,
    token: string,
  ): Promise<void> {
    try {
      await this.tasks.tasks.delete({
        oauth_token: token,
        tasklist: tasklistId,
        task: taskId,
      });
    } catch (error) {
      if (error.status === 401) {
        throw new HttpException('Invalid token', 401);
      }
      throw new Error('Failed to delete the task: ' + error.message);
    }
  }

  async moveTask(
    tasklistId: string,
    taskId: string,
    previousTaskId: string | undefined,
    token: string,
  ) {
    try {
      return this.tasks.tasks
        .move({
          oauth_token: token,
          tasklist: tasklistId,
          task: taskId,
          previous: previousTaskId,
        })
        .then((res) => {
          return res.data;
        });
    } catch (error) {
      if (error.status === 401) {
        throw new HttpException('Invalid token', 401);
      }
      throw new Error('Failed to move the task: ' + error.message);
    }
  }

  async updateTask(
    tasklistId: string,
    task: any,
    token: string,
  ): Promise<Task> {
    try {
      return this.tasks.tasks
        .patch({
          oauth_token: token,
          tasklist: tasklistId,
          task: task.id,
          requestBody: task,
        })
        .then((res) => res.data as Task);
    } catch (error) {
      if (error.status === 401) {
        throw new HttpException('Invalid token', 401);
      }
      throw new Error('Failed to update the task: ' + error.message);
    }
  }

  async createTask(
    tasklistId: string,
    task: CreateTaskDto,
    previousTaskId: string,
    token: string,
  ): Promise<Task> {
    try {
      return this.tasks.tasks
        .insert({
          oauth_token: token,
          tasklist: tasklistId,
          requestBody: task,
          previous: previousTaskId,
        })
        .then((res) => res.data as Task);
    } catch (error) {
      if (error.status === 401) {
        throw new HttpException('Invalid token', 401);
      }
      throw new Error('Failed to update the task: ' + error.message);
    }
  }

  async createTasksList(): Promise<any> {
    try {
      return this.tasks.tasklists.insert({
        oauth_token: "", // todo
        requestBody: {
          title: 'Task list Title',
        },
      });
    } catch (error) {
      throw new Error('Failed to update the task: ' + error.message);
    }
  }
}
