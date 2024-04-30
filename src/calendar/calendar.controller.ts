import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { request } from 'express';

@Controller('api/calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.calendarService.getCalendarList(
      request.headers['content-oauth'] as string,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(+id);
  }

  @Get(':id/events')
  findEvents(@Req() request: Request, @Param('id') id: string) {
    return this.calendarService.getEvents(
      request.headers['content-oauth'] as string,
      id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
  ) {
    return this.calendarService.update(+id, updateCalendarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarService.remove(+id);
  }
}
