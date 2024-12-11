import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv-flow';
import { User } from './src/users/entities/user.entity';
import { InitialMigration1733900003144 } from './migrations/1733900003144-InitialMigration';

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
  migrations: [InitialMigration1733900003144],
});
