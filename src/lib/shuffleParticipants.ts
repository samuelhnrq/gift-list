import type { ParticipantType } from "./participants.js";

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
  public readonly target: ParticipantType;
  constructor(current: ParticipantType) {
    super(`${current.id} has circular exclusions`);
    this.name = "CircularExclusionError";
    this.target = current;
  }
}

/**  assign participants to each other, respecting exclusions */
export function shuffleParticipants(
  participants: ParticipantType[],
): Record<string, string> {
  const assigned: Record<string, string> = {};
  const failedToAssing = new Set<string>();
  const remaining = participants.map((x) => x.id);
  const userMap: Record<string, ParticipantType> = Object.fromEntries(
    participants.map((x) => [x.id, x]),
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
    assigned[current.id] = target;
    current = userMap[target];
    remaining.splice(i, 1);
  }
  assigned[current.id] = firstTarget!;
  return assigned;
}
