ALTER TABLE "participant" DROP CONSTRAINT "participant_user_id_unique";--> statement-breakpoint
ALTER TABLE "participant" DROP CONSTRAINT "participant_user_id_user_id_fk";--> statement-breakpoint

ALTER TABLE "participant" ADD COLUMN "user_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "participant" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_user_email_unique" UNIQUE("user_email");
