import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1770196407011 implements MigrationInterface {
    name = 'InitMigration1770196407011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "sessionId"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "sessionId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "sessionId"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "sessionId" integer NOT NULL`);
    }

}
