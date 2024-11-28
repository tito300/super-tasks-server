import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    try {
      const response = await this.calendar.calendarList.list({
        oauth_token: token,
      });
      return response.data.items;
    } catch (error) {
      if (error?.status === 401) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  async getEvents(token: string, calendarId: string) {
    try {
      const events = await this.calendar.events.list({
        calendarId,
        oauth_token: token,
        // RFC3339 timestamp
        timeMin: dayjs().utc().subtract(1, 'day').startOf('day').toISOString(),
        timeMax: dayjs().utc().add(1, 'day').endOf('day').toISOString(),
      });
      return events;
    } catch (error) {
      if (error?.status === 401) {
        throw new UnauthorizedException();
      }

      throw error;
    }
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
