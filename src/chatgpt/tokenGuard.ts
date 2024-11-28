import { CanActivate, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { premiumModels } from './chatgpt.controller';
import * as dayjs from 'dayjs';
import { AiRequestBaseBody } from './dto/update-chat.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async canActivate(context) {
    // check if the model is a premium model, if so, check if todays usage limit is reached
    // if reached, return 429
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findOne(request.user?.username);

    const requestBody = request.body as AiRequestBaseBody;

    if (user.subscriptionType !== 'premium') {
      console.log('%%%%%%% model', requestBody.aiOptions.model);
      if (premiumModels.includes(requestBody.aiOptions.model)) {
        const beforeToday = dayjs(user.todayAiUsageTimestamp).isBefore(
          dayjs(),
          'day',
        );

        const dailyLimit = this.configService.get<number>('TODAYS_TOKEN_LIMIT');

        console.log('%%%%%%% beforeToday', beforeToday);
        console.log('%%%%%%% user.todayAiUsage', user.todayAiUsage);
        console.log('%%%%%%% this.todaysTokenLimit', dailyLimit);
        if (!beforeToday) {
          if (user.todayAiUsage >= dailyLimit) {
            request['aiLimitReached'] = true;
          }
        }
      }
    }

    return true;
  }
}
