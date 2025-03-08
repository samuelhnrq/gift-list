import { assertSession } from "@/auth";
import { db } from "@/db";
import { game, participant, participantToGame, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

export async function copyUserAsParticipant({
  id,
}: {
  id: string;
}): Promise<void> {
  await db
    .insert(participant)
    .values({
      userId: id,
    })
    .onConflictDoNothing({
      target: participant.userId,
    });
}

export const getCurrentParticipant = cache(async () => {
  const session = await assertSession();
  const participantUser = await db.query.participant.findFirst({
    where: eq(participant.userId, session.user.id),
  });
  if (!participantUser) {
    throw redirect("/");
  }
  return participantUser;
});

export const getParticipantsOfGame = cache(async (gameId: string) => {
  const { id: pId } = await getCurrentParticipant();
  const found = await db
    .select({ participant, user })
    .from(participant)
    .innerJoin(user, eq(user.id, participant.userId))
    .innerJoin(
      participantToGame,
      eq(participantToGame.participantId, participant.id),
    )
    .innerJoin(game, eq(game.id, participantToGame.gameId))
    .where(
      and(eq(participant.id, pId), eq(game.creator, pId), eq(game.id, gameId)),
    )
    .execute();
  return found;
});
