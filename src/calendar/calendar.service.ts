import { Injectable } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { google } from 'googleapis';
const dayjs = require('dayjs')

@Injectable()
export class CalendarService {
  private readonly calendar = google.calendar('v3');

  async getCalendarList(token: string) {
    const response = await this.calendar.calendarList.list({
      oauth_token: token
    });
    return response.data.items;
  }

  getEvents(token: string, calendarId: string) {
    console.log("time #######: ", dayjs().subtract(1, 'day').toISOString());
    return this.calendar.events.list({
      calendarId,
      oauth_token: token,
      // RFC3339 timestamp
      timeMax: dayjs().add(1, 'day').toISOString(),
      timeMin: dayjs().subtract(1, 'day').toISOString()
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
