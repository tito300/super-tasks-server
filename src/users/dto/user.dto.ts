import { User } from '../entities/user.entity';

export interface UserDTO
  extends Omit<
    User,
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'todayAiUsageTimestamp'
    | 'updateTodayAiUsageTimestamp'
  > {}
