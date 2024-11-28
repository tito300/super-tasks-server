import { UserDTO } from '../dto/user.dto';
import { User } from '../entities/user.entity';

export function mapUserToDto(user: User): UserDTO {
  const { createdAt, updatedAt, deletedAt, todayAiUsageTimestamp, ...userDTO } =
    user;

  return userDTO;
}
