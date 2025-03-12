"use server";

import { assertSession } from "@/lib/auth";
import { db } from "@/db";
import { cache } from "react";
import { game, participant, participantToGame } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { console } from "inspector";
import { getCurrentParticipant } from "./participants";
import {
  CircularExclusionError,
  shuffleParticipants,
} from "./shuffleParticipants";
import type { GameType, NewGameType } from "./models";

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

export const shuffleParticipantsAction = async (
  gameId: string,
): Promise<string> => {
  const profile = await getCurrentParticipant();
  let failure = "";
  try {
    await db.transaction(async (tx) => {
      const participants = await tx
        .select({ participantToGame, participant })
        .from(participantToGame)
        .innerJoin(game, eq(game.id, participantToGame.gameId))
        .innerJoin(
          participant,
          eq(participant.id, participantToGame.participantId),
        )
        .where(and(eq(game.creator, profile.id), eq(game.id, gameId)))
        .execute();
      let assignments: Record<string, string> = {};
      try {
        assignments = shuffleParticipants(
          participants.map((x) => x.participantToGame),
        );
      } catch (err) {
        if (err instanceof CircularExclusionError) {
          const badUser = participants.find((x) => x.participant.id === err.id);
          failure = `Participant ${badUser?.participant.userEmail} has circular exclusions`;
        }
        failure = "Failed to shuffle, maybe circular exclusions?";
        tx.rollback();
      }
      await tx
        .insert(participantToGame)
        .values(
          Object.entries(assignments).map(([k, v]) => ({
            gameId,
            participantId: k,
            givesTo: v,
          })),
        )
        .onConflictDoUpdate({
          target: [participantToGame.participantId, participantToGame.gameId],
          set: { givesTo: sql`excluded.gives_to`, updatedAt: sql`now()` },
        });
      await tx
        .update(game)
        .set({ status: "shuffled" })
        .where(eq(game.id, gameId));
    });
  } catch (e) {
    console.error("error", e);
    return failure || `${e}`;
  }
  revalidatePath(`/games/${gameId}`, "page");
  return "";
};

export const clearGivesToAction = async (gameId: string): Promise<string> => {
  const profile = await getCurrentParticipant();
  await db.transaction(async (tx) => {
    const affected = await tx
      .update(game)
      .set({ status: "open", updatedAt: sql`now()` })
      .where(and(eq(game.id, gameId), eq(game.creator, profile.id)))
      .returning({ ok: game.id });
    if (affected.length === 0 || affected[0].ok !== gameId) {
      tx.rollback();
    }
    await tx
      .update(participantToGame)
      .set({ givesTo: null, updatedAt: sql`now()` })
      .where(eq(participantToGame.gameId, gameId));
  });
  revalidatePath(`/games/${gameId}`, "page");
  return gameId;
};

export const createGameActiton = async (form: FormData): Promise<void> => {
  const name = form.get("name");
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
