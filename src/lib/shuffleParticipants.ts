import type { ParticipantToGameType } from "./models";

function pickRandom<T>(arr: T[]): [number, T] {
  if (arr.length === 0) {
    throw new Error("empty array");
  }
  if (arr.length === 1) {
    return [0, arr[0]];
  }
  const i = Math.floor(Math.random() * arr.length);
  return [i, arr[i]];
}

export class CircularExclusionError extends Error {
  public readonly id: string;
  constructor(participant: ParticipantToGameType) {
    super(`${participant.participantId} has circular exclusions`);
    this.name = "CircularExclusionError";
    this.id = participant.participantId;
  }
}

/**  assign participants to each other, respecting exclusions */
export function shuffleParticipants(
  participants: ParticipantToGameType[],
): Record<string, string> {
  if (participants.length < 2) {
    throw new Error("Not enough participants");
  }
  const assigned: Record<string, string> = {};
  const failedToAssing = new Set<string>();
  const remaining = participants.map((x) => x.participantId);
  const userMap: Record<string, ParticipantToGameType> = Object.fromEntries(
    participants.map((x) => [x.participantId, x]),
  );
  let firstTarget: string | null = null;
  let current = participants[0];
  while (remaining.length > 0) {
    const [i, target] = pickRandom(remaining);
    if (failedToAssing.has(target)) {
      continue;
    }
    if (current.exclusions.includes(target)) {
      failedToAssing.add(target);
      if (failedToAssing.size === remaining.length) {
        throw new CircularExclusionError(current);
      }
      continue;
    }
    firstTarget ??= target;
    failedToAssing.clear();
    assigned[current.participantId] = target;
    current = userMap[target];
    remaining.splice(i, 1);
  }
  if (!firstTarget) {
    throw new Error("no participants left");
  }
  if (userMap[current.participantId].exclusions.includes(firstTarget)) {
    throw new CircularExclusionError(current);
  }
  assigned[current.participantId] = firstTarget;
  return assigned;
}
