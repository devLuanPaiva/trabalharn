import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSocialPostIdsToJobOpenings1787314334496
  implements MigrationInterface
{
  name = 'AddSocialPostIdsToJobOpenings1787314334496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_openings" ADD "facebook_post_id" character varying(120)`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_openings" ADD "instagram_media_id" character varying(120)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_openings" DROP COLUMN "instagram_media_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_openings" DROP COLUMN "facebook_post_id"`,
    );
  }
}
