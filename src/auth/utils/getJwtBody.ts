import { User } from 'src/users/entities/user.entity';
import { JWTUser } from '../types';

/**
 * googleAccessToken is optional because it's only used when the user uses Google Integrations
 * but for things like ai, it's not needed.
 */
export function getJwtBody(user: User, googleAccessToken?: string): JWTUser {
  return {
    sub: user.id,
    id: user.id,
    username: user.username,
    email: user.email,
    subscriptionType: user.subscriptionType,
    googleAccessToken: googleAccessToken,
    todayAiUsage: user.todayAiUsage,
    todayAiUsageTimestamp: user.todayAiUsageTimestamp,
  };
}
