import { getSession } from "@/auth";
import { db } from "@/db";
import { participant } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function getCurrentParticipant() {
  const session = await getSession();
  if (!session?.user?.id) {
    return null;
  }
  const participantUser = await db.query.participant.findFirst({
    where: eq(participant.userId, session.user.id),
    with: {
      participantGames: {
        with: {
          game: true,
        },
      },
    },
  });

  return participantUser || null;
}
