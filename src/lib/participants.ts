"use server";

import { assertSession } from "@/lib/auth";
import { db } from "@/db";
import { game, participant, participantToGame, user } from "@/db/schema";
import { aliasedTable, and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { GameParticipant } from "./models";
import { notifyParticipant } from "./email";

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
  const found: GameParticipant[] = await db
    .select({ participant, user, target, ptg: participantToGame })
    .from(participant)
    .leftJoin(user, eq(user.email, participant.userEmail))
    .innerJoin(
      participantToGame,
      eq(participantToGame.participantId, participant.id),
    )
    .leftJoin(target, eq(participantToGame.givesTo, target.id))
    .innerJoin(game, eq(game.id, participantToGame.gameId))
    .where(and(eq(game.creator, pId), eq(game.id, gameId)))
    .orderBy(participantToGame.createdAt)
    .execute();
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
        .where(
          and(
            eq(participantToGame.participantId, participantId),
            eq(participantToGame.gameId, gameId),
          ),
        );
      await tx
        .update(participantToGame)
        .set({ exclusions: sql`array_remove(exclusions, ${participantId})` })
        .where(and(eq(participantToGame.gameId, gameId)));
    });
    revalidatePath(`/games/${gameId}`, "page");
  } catch (e) {
    console.error(e);
  }
};

export const updateParticipantGameAction = async (
  ptg: GameParticipant,
  formData: FormData,
): Promise<GameParticipant> => {
  const alias = formData.get("alias")?.toString() || null;
  const exclusionsTxt = formData.get("exclusions")?.toString();
  const exclusions = (exclusionsTxt && exclusionsTxt.split(",")) || [];
  console.log("updating participant", ptg.participant.id, alias, exclusions);
  const profile = await getCurrentParticipant();
  try {
    await db.transaction(async (tx) => {
      const cont = await tx.$count(
        game,
        and(eq(game.id, ptg.ptg.gameId), eq(game.creator, profile.id)),
      );
      if (cont <= 0 || cont > 1) {
        return;
      }
      await tx
        .update(participantToGame)
        .set({ alias, exclusions, updatedAt: sql`now()` })
        .where(
          and(
            eq(participantToGame.participantId, ptg.ptg.participantId),
            eq(participantToGame.gameId, ptg.ptg.gameId),
          ),
        );
    });
    revalidatePath(`/games/${ptg.ptg.gameId}`, "page");
    return ptg;
  } catch (e) {
    console.error(e);
    return ptg;
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
  console.log("adding participant", email);
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
      await tx
        .insert(participant)
        .values({ userEmail: email })
        .onConflictDoNothing({ target: participant.userEmail })
        .returning({ id: participant.id });
      const [newParticipant] = await tx
        .select({ id: participant.id })
        .from(participant)
        .where(eq(participant.userEmail, email));
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

export const notifyParticipantsAction = async (
  gameId: string,
): Promise<string> => {
  if (!gameId) {
    return gameId;
  }
  const profile = await getCurrentParticipant();
  await db.transaction(async (tx) => {
    const recipients = await db
      .select({
        participantToGame,
        user,
        game,
        participant,
        ptg: participantToGame,
      })
      .from(participantToGame)
      .innerJoin(
        participant,
        eq(participant.id, participantToGame.participantId),
      )
      .leftJoin(user, eq(user.email, participant.userEmail))
      .innerJoin(game, eq(game.id, participantToGame.gameId))
      .where(
        and(
          eq(game.id, gameId),
          eq(game.creator, profile.id),
          eq(game.status, "shuffled"),
        ),
      );
    const recipientMap = Object.fromEntries(
      recipients.map((x) => [x.participant.id, x]),
    );
    try {
      await Promise.all(
        recipients.map((x) =>
          notifyParticipant(x, recipientMap[x.participantToGame.givesTo || ""]),
        ),
      );
    } catch (e) {
      console.error("email error", e);
      tx.rollback();
    }
    await tx.update(game).set({ status: "closed" }).where(eq(game.id, gameId));
  });
  revalidatePath(`/games/${gameId}`, "page");
  return gameId;
};
