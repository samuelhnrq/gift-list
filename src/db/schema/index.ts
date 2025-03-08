import {
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
export * from "./auth-schema";

export const participant = pgTable("participant", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  exclusions: uuid("exclusions").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const participantRelations = relations(participant, ({ one, many }) => ({
  profileInfo: one(user, {
    fields: [participant.userId],
    references: [user.id],
  }),
  participantGames: many(participantToGame),
}));

export const game = pgTable("game", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  creator: uuid("creator")
    .notNull()
    .references(() => participant.id, { onDelete: "cascade" }),
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
  }),
);
