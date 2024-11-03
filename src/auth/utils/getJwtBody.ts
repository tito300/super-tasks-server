import { User } from 'src/users/entities/user.entity';

export function getJwtBody(user: User) {
  return {
    sub: user.id,
    username: user.username,
    email: user.email,
    subscriptionType: user.subscriptionType,
  };
}
