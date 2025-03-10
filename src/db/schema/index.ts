import {
  pgTable,
  text,
  pgEnum,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
export * from "./auth-schema";

export const participant = pgTable("participant", {
  id: uuid("id").primaryKey().defaultRandom(),
  userEmail: text("user_email").notNull().unique(),
  exclusions: uuid("exclusions").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const participantRelations = relations(participant, ({ one, many }) => ({
  profileInfo: one(user, {
    fields: [participant.userEmail],
    references: [user.email],
  }),
  participantGames: many(participantToGame),
  recievesFrom: many(participantToGame),
}));
export const gameStatus = pgEnum("game_status", ["open", "shuffled", "closed"]);

export const game = pgTable("game", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  creator: uuid("creator")
    .notNull()
    .references(() => participant.id, { onDelete: "cascade" }),
  status: gameStatus("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gameRelations = relations(game, ({ many, one }) => ({
  gameParticipants: many(participantToGame),
  creator: one(participant, {
    fields: [game.creator],
    references: [participant.id],
  }),
}));

export const participantToGame = pgTable(
  "participants_to_games",
  {
    participantId: uuid("participant_id")
      .notNull()
      .references(() => participant.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => game.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    givesTo: uuid("gives_to").references(() => participant.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.participantId, t.gameId] })],
);

export const participantToGameRelations = relations(
  participantToGame,
  ({ one }) => ({
    participant: one(participant, {
      fields: [participantToGame.participantId],
      references: [participant.id],
    }),
    game: one(game, {
      fields: [participantToGame.gameId],
      references: [game.id],
    }),
    givesTo: one(participant, {
      fields: [participantToGame.givesTo],
      references: [participant.id],
    }),
  }),
);
