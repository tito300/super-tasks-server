import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1733900003144 implements MigrationInterface {
  name = 'InitialMigration1733900003144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE public.user_subscriptiontype_enum AS ENUM ('free', 'premium');`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "subscriptionType" "public"."user_subscriptiontype_enum" NOT NULL DEFAULT 'free', "accountId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "todayAiUsage" integer NOT NULL DEFAULT '0', "todayAiUsageTimestamp" TIMESTAMP NOT NULL DEFAULT '"2024-12-11T06:53:24.977Z"', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
