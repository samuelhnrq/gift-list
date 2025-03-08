"use server";

import { assertSession } from "@/auth";
import { db } from "@/db";
import { cache } from "react";
import { game, participant, participantToGame } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { console } from "inspector";
import { getCurrentParticipant } from "./participants";

export type GameType = typeof game.$inferSelect;
export type NewGameType = typeof game.$inferInsert;

export const getGames = cache(async (): Promise<GameType[]> => {
  const session = await assertSession();
  const games = await db
    .select({ game })
    .from(game)
    .innerJoin(participant, eq(participant.id, game.creator))
    .where(eq(participant.userEmail, session.user.email))
    .execute();
  return games.map((game) => game.game);
});

export const getGame = cache(async (gameId: string) => {
  const participant = await getCurrentParticipant();
  const found = await db.query.game.findFirst({
    where: and(eq(game.id, gameId), eq(game.creator, participant.id)),
  });
  return found;
});

export const deleteGameAction = async (gameId: string): Promise<void> => {
  const profile = await getCurrentParticipant();
  if (gameId.length !== 36) {
    console.log("gameId is not a uuid", gameId);
    return;
  }
  try {
    await db
      .delete(game)
      .where(and(eq(game.id, gameId), eq(game.creator, profile.id)));
    revalidatePath("/games", "page");
  } catch (e) {
    console.error(e);
  }
};

export const createGameActiton = async (form: FormData): Promise<void> => {
  console.log("form", form);
  const name = form.get("name");
  console.log(name);
  if (typeof name !== "string") {
    throw new Error("Name is not a string");
  }
  const session = await assertSession();
  await db.transaction(async (tx) => {
    // Intentionally not using cached Pariticipant from ./participants (might be out of date)
    const [currentParticipant] = await tx
      .select()
      .from(participant)
      .where(eq(participant.userEmail, session.user.email));

    if (!currentParticipant) {
      tx.rollback();
    }
    const newGame: NewGameType = {
      name,
      creator: currentParticipant.id,
    };
    const [result] = await tx.insert(game).values(newGame).returning({
      id: game.id,
      name: game.name,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    });
    if (!result) {
      tx.rollback();
    }
    await tx
      .insert(participantToGame)
      .values({ participantId: currentParticipant.id, gameId: result.id })
      .execute();
  });
  revalidatePath("/games");
};
