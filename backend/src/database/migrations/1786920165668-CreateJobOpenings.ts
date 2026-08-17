import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobOpenings1786920165668 implements MigrationInterface {
  name = 'CreateJobOpenings1786920165668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "job_openings" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" character varying(255) NOT NULL, "description" text, "requirements" text, "wage" character varying(120), "working_hours" character varying(120), "contract_type" character varying(60), "location" character varying(160), "company_name" character varying(160), "company_email" character varying(160), "company_contact" character varying(160), "source" character varying(80) NOT NULL, "external_id" character varying(120), "post_url" character varying(2048) NOT NULL, "hash" character varying(64) NOT NULL, "published_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_bb618a9d05d9c3f5d31d5c2dd94" UNIQUE ("hash"), CONSTRAINT "PK_6888a7e6783262ac38387fc3e8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_890bf2d456c3036ab18e14cdce" ON "job_openings"  ("contract_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e8a57b12b139f4f9efbf0463c" ON "job_openings"  ("location") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_888486fa24dde51b7497694aff" ON "job_openings"  ("source") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_888486fa24dde51b7497694aff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5e8a57b12b139f4f9efbf0463c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_890bf2d456c3036ab18e14cdce"`,
    );
    await queryRunner.query(`DROP TABLE "job_openings"`);
  }
}
