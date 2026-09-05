import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1757030000000 implements MigrationInterface {
  name = 'InitialSchema1757030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY,
        "name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_email_key" ON "users" ("email")`,
    );

    await queryRunner.query(`
      CREATE TABLE "refresh_sessions" (
        "id" uuid PRIMARY KEY,
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "token_hash" varchar NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL,
        "revoked_at" timestamptz
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "refresh_sessions_user_id_idx" ON "refresh_sessions" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "space_id" varchar NOT NULL,
        "created_by" varchar NOT NULL,
        "category_id" varchar NOT NULL,
        "type" varchar NOT NULL,
        "description" varchar NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "date" timestamp NOT NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "transactions_space_id_idx" ON "transactions" ("space_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "refresh_sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
