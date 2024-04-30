import { Injectable } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { google } from 'googleapis';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Injectable()
export class CalendarService {
  private readonly calendar = google.calendar('v3');

  async getCalendarList(token: string) {
    const response = await this.calendar.calendarList.list({
      oauth_token: token,
    });
    return response.data.items;
  }

  getEvents(token: string, calendarId: string) {
    console.log('start time #######: ', dayjs().startOf('day').toISOString());
    console.log('end time #######: ', dayjs().endOf('day').toISOString());
    return this.calendar.events.list({
      calendarId,
      oauth_token: token,
      // RFC3339 timestamp
      timeMin: dayjs().startOf('day').toISOString(),
      timeMax: dayjs().endOf('day').toISOString(),
    });
  }

  create(createCalendarDto: CreateCalendarDto) {
    return 'This action adds a new calendar';
  }

  findAll() {
    return `This action returns all calendar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calendar`;
  }

  update(id: number, updateCalendarDto: UpdateCalendarDto) {
    return `This action updates a #${id} calendar`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendar`;
  }
}
