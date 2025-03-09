import type { ParticipantType } from "./participants";
import { shuffleParticipants } from "./shuffleParticipants";

function makeParticipant(
  id: string,
  exclusions: string[] = [],
): ParticipantType {
  return {
    id,
    exclusions,
    createdAt: new Date(),
    updatedAt: new Date(),
    userEmail: "",
  };
}

it("shuffles participants", () => {
  const participants = [
    makeParticipant("1"),
    makeParticipant("2"),
    makeParticipant("3"),
    makeParticipant("4"),
    makeParticipant("5"),
  ];
  for (let i = 0; i < 100; i++) {
    const assigned = shuffleParticipants(participants);
    const keys = Object.keys(assigned).sort();
    expect(keys).toEqual(["1", "2", "3", "4", "5"]);
    const values = Object.values(assigned).sort();
    expect(new Set(values).size).toEqual(values.length);
    expect(values).toEqual(["1", "2", "3", "4", "5"]);
  }
});

it("respects exclusions", () => {
  const participants = [
    makeParticipant("1", ["2"]),
    makeParticipant("2", ["3"]),
    makeParticipant("3", ["1"]),
  ];
  const assigned = shuffleParticipants(participants);
  expect(assigned).toEqual({
    "1": "3",
    "2": "1",
    "3": "2",
  });
});
