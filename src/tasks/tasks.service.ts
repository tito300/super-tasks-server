import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as path from 'path';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, 'super-tasks-key-413803-1ddfe134af31.json'), // Path to your service account key file
//   scopes: ['https://www.googleapis.com/auth/tasks'], // Specify the scopes needed
// });
const auth =
  'ya29.a0AfB_byDfIK7g0zMQ-oxeLCJkxi78aaKNsVvc5il-smhEUvfj1eLMUMzWobvTLxuGGbtpGE69ozCSyXCI0vj2MUqGN5A23M25kG40HnfjAW5jbk_J3PiUD64K_8Pb_i9xFOexvvFeRmESnr6bjJnVmDRM1uz-WjER58YaCgYKARgSARASFQHGX2MitE_c9AmAU1L4VxJ7LYCTLg0170';

@Injectable()
export class TasksService {
  private tasks = google.tasks('v1');

  constructor() {}

  async listTaskList(token: string): Promise<Task[]> {
    try {
      const response = await this.tasks.tasklists.list({
        oauth_token: token,
      });
      return response.data as Task[]; // This returns the tasks in the specified task list
    } catch (error) {
      throw new Error('Failed to list tasks: ' + error.message);
    }
  }

  async listTasks(tasklistId: string, token: string): Promise<Task[]> {
    try {
      const response = await this.tasks.tasks.list({
        oauth_token: token,
        tasklist: tasklistId,
      });
      return response.data as Task[]; // This returns the tasks in the specified task list
    } catch (error) {
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
      throw new Error('Failed to update the task: ' + error.message);
    }
  }

  async createTasksList(): Promise<any> {
    try {
      return this.tasks.tasklists.insert({
        oauth_token: auth,
        requestBody: {
          title: 'Task list Title',
        },
      });
    } catch (error) {
      throw new Error('Failed to update the task: ' + error.message);
    }
  }
}
