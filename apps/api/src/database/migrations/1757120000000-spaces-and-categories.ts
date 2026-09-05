import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpacesAndCategories1757120000000 implements MigrationInterface {
  name = 'SpacesAndCategories1757120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "spaces" (
        "id" uuid PRIMARY KEY,
        "name" varchar NOT NULL,
        "code" varchar NOT NULL,
        "owner_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "created_at" timestamptz NOT NULL
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "spaces_code_key" ON "spaces" ("code")`,
    );

    await queryRunner.query(`
      CREATE TABLE "space_members" (
        "space_id" uuid NOT NULL REFERENCES "spaces" ("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "slot" varchar NOT NULL,
        "role" varchar NOT NULL,
        "joined_at" timestamptz NOT NULL,
        PRIMARY KEY ("space_id", "user_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "space_members_user_id_idx" ON "space_members" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "space_invites" (
        "id" uuid PRIMARY KEY,
        "space_id" uuid NOT NULL REFERENCES "spaces" ("id") ON DELETE CASCADE,
        "email" varchar NOT NULL,
        "status" varchar NOT NULL,
        "sent_at" timestamptz NOT NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "space_invites_space_id_idx" ON "space_invites" ("space_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY,
        "space_id" uuid NOT NULL REFERENCES "spaces" ("id") ON DELETE CASCADE,
        "name" varchar NOT NULL,
        "tag" varchar NOT NULL,
        "description" varchar NOT NULL DEFAULT '',
        "kind" varchar NOT NULL,
        "color" varchar NOT NULL,
        "monthly_limit_cents" integer,
        "scope" varchar NOT NULL,
        "owner_id" uuid REFERENCES "users" ("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "categories_space_id_idx" ON "categories" ("space_id")`,
    );

    // Rebuilt rather than altered: the old shape stored reais as numeric and had no payer or
    // split, and there is no production data to preserve.
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid PRIMARY KEY,
        "space_id" uuid NOT NULL REFERENCES "spaces" ("id") ON DELETE CASCADE,
        "kind" varchar NOT NULL,
        "description" varchar NOT NULL,
        "amount_cents" integer NOT NULL,
        "category_id" uuid NOT NULL REFERENCES "categories" ("id") ON DELETE RESTRICT,
        "payer_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "split" varchar NOT NULL,
        "date" date NOT NULL,
        "recurring" boolean NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "transactions_space_date_idx" ON "transactions" ("space_id", "date")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "space_invites"`);
    await queryRunner.query(`DROP TABLE "space_members"`);
    await queryRunner.query(`DROP TABLE "spaces"`);
  }
}
