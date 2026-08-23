import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueSourceExternalIdToJobOpenings1787399920992
  implements MigrationInterface
{
  name = 'AddUniqueSourceExternalIdToJobOpenings1787399920992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "job_openings"
      WHERE "id" IN (
        SELECT "id" FROM (
          SELECT
            "id",
            ROW_NUMBER() OVER (
              PARTITION BY "source", "external_id"
              ORDER BY
                ("facebook_post_id" IS NOT NULL OR "instagram_media_id" IS NOT NULL) DESC,
                "created_at" ASC,
                "id" ASC
            ) AS rn
          FROM "job_openings"
          WHERE "external_id" IS NOT NULL
        ) ranked
        WHERE rn > 1
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "job_openings" ADD CONSTRAINT "UQ_job_openings_source_external_id" UNIQUE ("source", "external_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_openings" DROP CONSTRAINT "UQ_job_openings_source_external_id"`,
    );
  }
}
