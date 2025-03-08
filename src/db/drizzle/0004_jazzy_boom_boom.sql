ALTER TABLE "participant" DROP CONSTRAINT "participant_user_id_unique";
ALTER TABLE "participant" DROP CONSTRAINT "participant_user_id_user_id_fk";

ALTER TABLE "participant" ADD COLUMN "user_email" text NOT NULL;
ALTER TABLE "participant" DROP COLUMN "user_id";
ALTER TABLE "participant" ADD CONSTRAINT "participant_user_email_unique" UNIQUE("user_email");