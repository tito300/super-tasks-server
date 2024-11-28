import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserDateAndAiLimitColumns1731312429016 implements MigrationInterface {
    name = 'AddUserDateAndAiLimitColumns1731312429016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "todayAiUsageTimestamp" SET DEFAULT '"2024-11-11T08:07:10.706Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "todayAiUsageTimestamp" SET DEFAULT '2024-11-11 08:02:40.801'`);
    }

}
