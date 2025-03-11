import type { game, participant, participantToGame, user } from "@/db/schema";

export type GameType = typeof game.$inferSelect;
export type NewGameType = typeof game.$inferInsert;
export type ParticipantType = typeof participant.$inferSelect;
export type UserType = typeof user.$inferSelect;
export type ParticipantToGameType = typeof participantToGame.$inferSelect;

export type GameParticipant = {
  participant: ParticipantType;
  user?: UserType | null;
  target?: ParticipantType;
  ptg: ParticipantToGameType;
};

export interface AssignedNotification {
  game: GameType;
  user?: UserType | null;
  participant: ParticipantType;
  ptg: ParticipantToGameType;
}
