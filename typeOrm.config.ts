import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv-flow';
import { User } from './src/users/entities/user.entity';
import { AddUserEntity1730581088273 } from './migrations/1730581088273-addUserEntity';
import { AddUserDateColumns1730618461014 } from './migrations/1730618461014-addUserDateColumns';
import { AddUserDateAndAiLimitColumns1731312429016 } from './migrations/1731312429016-AddUserDateAndAiLimitColumns';

dotenv.config();

console.log('DATABASE_URL: ', process.env.DATABASE_URL);

export default new DataSource({
  type: 'postgres',
  ssl: {
    rejectUnauthorized: false,
    requestCert: false,
  },
  url: process.env.DATABASE_URL,
  entities: [User],
  migrations: [
    AddUserEntity1730581088273,
    AddUserDateColumns1730618461014,
    AddUserDateAndAiLimitColumns1731312429016,
  ],
});
