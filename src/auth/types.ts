import { SubscriptionType } from 'src/users/entities/user.entity';

export type JWTUser = {
  sub: number;
  id: number;
  username: string;
  email: string;
  subscriptionType: SubscriptionType;
  todayAiUsage: number;
  googleAccessToken?: string;
  todayAiUsageTimestamp: Date;
};

declare module 'express' {
  interface Request {
    user?: JWTUser;
  }
}

export {};
