import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostGeneratorPayloadToJobOpenings1787332878801
  implements MigrationInterface
{
  name = 'AddPostGeneratorPayloadToJobOpenings1787332878801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_openings" ADD "post_generator_payload" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_openings" DROP COLUMN "post_generator_payload"`,
    );
  }
}
