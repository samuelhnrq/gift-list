CREATE TYPE "public"."game_status" AS ENUM('open', 'shuffled', 'closed');--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "status" "game_status" DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_games" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_games" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_games" ADD COLUMN "gives_to" uuid;--> statement-breakpoint
ALTER TABLE "participants_to_games" ADD COLUMN "exclusions" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "participants_to_games" ADD COLUMN "alias" text;--> statement-breakpoint
ALTER TABLE "participants_to_games" ADD CONSTRAINT "participants_to_games_gives_to_participant_id_fk" FOREIGN KEY ("gives_to") REFERENCES "public"."participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" DROP COLUMN "exclusions";
