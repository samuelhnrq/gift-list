"use server";

import { assertSession } from "@/auth";
import { db } from "@/db";
import { game, participant, participantToGame, user } from "@/db/schema";
import { aliasedTable, and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";

export type ParticipantType = typeof participant.$inferSelect;
export type ParticipantToGameType = typeof participantToGame.$inferSelect;

export const copyUserAsParticipant = async (userId: string): Promise<void> => {
  const [newUser] = await db.select().from(user).where(eq(user.id, userId));
  if (!user) {
    throw new Error("User not found");
  }
  await db
    .insert(participant)
    .values({ userEmail: newUser.email })
    .onConflictDoNothing({ target: participant.userEmail });
};

export const getCurrentParticipant = cache(async () => {
  const session = await assertSession();
  const [participantUser] = await db
    .select()
    .from(participant)
    .where(eq(participant.userEmail, session.user.email));
  if (!participantUser) {
    throw redirect("/");
  }
  return participantUser;
});

export const getParticipantsOfGame = cache(async (gameId: string) => {
  const { id: pId } = await getCurrentParticipant();
  const target = aliasedTable(participant, "target");
  const found = await db
    .select({ participant, user, target })
    .from(participant)
    .leftJoin(user, eq(user.email, participant.userEmail))
    .innerJoin(
      participantToGame,
      eq(participantToGame.participantId, participant.id),
    )
    .leftJoin(target, eq(target.id, participantToGame.givesTo))
    .innerJoin(game, eq(game.id, participantToGame.gameId))
    .where(and(eq(game.creator, pId), eq(game.id, gameId)))
    .orderBy(participantToGame.createdAt);
  return found;
});

export const deleteParticipantAction = async (
  gameId: string,
  participantId: string,
): Promise<void> => {
  const profile = await getCurrentParticipant();
  if (participantId.length !== 36) {
    console.log("participantId is not a uuid", participantId);
    return;
  }
  if (gameId.length !== 36) {
    console.log("gameId is not a uuid", gameId);
    return;
  }
  try {
    await db.transaction(async (tx) => {
      const cont = await tx.$count(
        game,
        and(eq(game.id, gameId), eq(game.creator, profile.id)),
      );
      if (cont <= 0 || cont > 1) {
        return;
      }
      await tx
        .delete(participantToGame)
        .where(and(eq(participantToGame.participantId, participantId)));
    });
    revalidatePath(`/games/${gameId}`, "page");
  } catch (e) {
    console.error(e);
  }
};

export const addParticipantAction = async (
  gameId: string,
  formData: FormData,
): Promise<string> => {
  const email = formData.get("email");
  if (typeof email !== "string") {
    console.log("email is not a string", email);
    return "";
  }
  if (gameId.length !== 36) {
    console.log("gameId is not a uuid", gameId);
    return "";
  }
  const profile = await getCurrentParticipant();
  try {
    await db.transaction(async (tx) => {
      const cont = await tx.$count(
        game,
        and(eq(game.id, gameId), eq(game.creator, profile.id)),
      );
      if (cont <= 0 || cont > 1) {
        tx.rollback();
      }
      const [newParticipant] = await tx
        .insert(participant)
        .values({ userEmail: email })
        .onConflictDoNothing({ target: participant.userEmail })
        .returning({ id: participant.id });
      if (!newParticipant.id) {
        tx.rollback();
      }
      await tx
        .insert(participantToGame)
        .values({ participantId: newParticipant.id, gameId })
        .onConflictDoNothing();
    });
    revalidatePath(`/games/${gameId}`, "page");
    return gameId;
  } catch (e) {
    console.error(e);
    return gameId;
  }
};
