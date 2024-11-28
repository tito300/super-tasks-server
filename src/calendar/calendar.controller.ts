import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/calendars')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() request: Request) {
    // throw new Error('Not implemented');

    return this.calendarService.getCalendarList(
      request.headers['content-oauth'] as string,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/events')
  findEvents(@Req() request: Request, @Param('id') id: string) {
    // return 401 if no token
    // throw new UnauthorizedException();

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

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
