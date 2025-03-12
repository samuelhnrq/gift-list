import { db } from "@/db";
import { game, participant, participantToGame } from "@/db/schema";
import { it, vi, expect, beforeEach } from "vitest";
import { addParticipantAction } from "./participants";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

vi.mock("@/db");
vi.mock("@/lib/auth");
vi.mock("@/lib/email");
vi.mock("next/cache");

beforeEach(async () => {
  await db.delete(participant);
  await db.delete(game);
  await db.delete(participantToGame);
});

it("adds participant to a game", async () => {
  const [{ id }] = await db
    .insert(participant)
    .values({ userEmail: "test@test.com" })
    .returning({ id: participant.id });
  const [{ gameId }] = await db
    .insert(game)
    .values({ name: "test", creator: id })
    .returning({ gameId: game.id });
  const form = new FormData();
  form.set("email", "other@test.com");
  await addParticipantAction(gameId, form);
  expect(revalidatePath).toHaveBeenCalled();
  expect(revalidatePath).toHaveBeenCalledWith(`/games/${gameId}`, "page");
  const ttl = await db.$count(
    participant,
    eq(participant.userEmail, "other@test.com"),
  );
  expect(ttl).toEqual(1);
  const ptgs = await db.$count(
    participantToGame,
    eq(participantToGame.gameId, gameId),
  );
  expect(ptgs).toEqual(1);
});

it("does not add participant to a game if already exists", async () => {
  const [{ id }] = await db
    .insert(participant)
    .values({ userEmail: "test@test.com" })
    .returning({ id: participant.id });
  const [{ gameId }] = await db
    .insert(game)
    .values({ name: "test", creator: id })
    .returning({ gameId: game.id });
  const form = new FormData();
  form.set("email", "test@test.com");
  await addParticipantAction(gameId, form);
  expect(revalidatePath).toHaveBeenCalled();
  expect(revalidatePath).toHaveBeenCalledWith(`/games/${gameId}`, "page");
  const ttl = await db.$count(
    participant,
    eq(participant.userEmail, "test@test.com"),
  );
  expect(ttl).toEqual(1);
  const ptgs = await db.$count(
    participantToGame,
    eq(participantToGame.gameId, gameId),
  );
  expect(ptgs).toEqual(1);
});
