import type { ParticipantType } from "./participants.js";

/**  assign participants to each other, respecting exclusions */
export function shuffleParticipants(
  participants: ParticipantType[],
): Record<string, string> {
  const remaining = participants.map((x) => x.id);
  const userMap = Object.fromEntries(participants.map((x) => [x.id, x]));
  const assigned: Record<string, string> = {};
  let firstTarget: string | null = null;
  let current = participants[0];
  while (remaining.length > 0) {
    const nextIndex =
      remaining.length === 1 ? 0 : Math.floor(Math.random() * remaining.length);
    console.log("it was ", remaining, nextIndex, current.id);
    const targetId = remaining[nextIndex];
    if (current.exclusions.includes(targetId)) {
      continue;
    }
    firstTarget ??= targetId;
    assigned[current.id] = targetId;
    current = userMap[targetId];
    remaining.splice(nextIndex, 1);
    console.log("it is now ", remaining, nextIndex, current.id, assigned);
  }
  assigned[current.id] = firstTarget!;
  console.log("final", assigned);
  return assigned;
}
