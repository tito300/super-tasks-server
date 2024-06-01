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

  async getEvents(token: string, calendarId: string) {
    const events = await this.calendar.events.list({
      calendarId,
      oauth_token: token,
      // RFC3339 timestamp
      timeMin: dayjs().utc().subtract(2, 'week').startOf('day').toISOString(),
      timeMax: dayjs().utc().add(2, 'week').endOf('day').toISOString(),
    });
    return events;

    // to be considered
    // const recurringEvents = events.data.items.filter((event) => {
    //   return event.recurrence?.length;
    // });

    // this.calendar.events
    //   .instances({
    //     oauth_token: token,
    //     calendarId,
    //     eventId: recurringEvents.find(
    //       (event) => event.summary === 'test recurring',
    //     ).id,
    //     showDeleted: true,
    //     timeMin: dayjs().utc().startOf('day').toISOString(),
    //     timeMax: dayjs().utc().endOf('day').toISOString(),
    //   })
    //   .then((res) => {
    //     console.log('##########x#### res: ', res.data.items);
    //     console.log('##########x#### item: ', res.data.items[0]);
    //   });
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
