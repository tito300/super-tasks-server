import { User } from 'src/users/entities/user.entity';
import { JWTUser } from '../types';

export function getJwtBody(user: User): JWTUser {
  return {
    sub: user.id,
    id: user.id,
    username: user.username,
    email: user.email,
    subscriptionType: user.subscriptionType,
    todayAiUsage: user.todayAiUsage,
    todayAiUsageTimestamp: user.todayAiUsageTimestamp,
  };
}
