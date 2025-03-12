import type { ParticipantToGameType } from "./models";
import {
  CircularExclusionError,
  shuffleParticipants,
} from "./shuffleParticipants";
import { it, expect } from "vitest";

function makeParticipant(
  id: string,
  exclusions: string[] = [],
): ParticipantToGameType {
  return {
    participantId: id,
    gameId: "gameId",
    createdAt: new Date(),
    updatedAt: new Date(),
    givesTo: null,
    alias: null,
    exclusions,
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
    for (let i = 1; i <= values.length; i++) {
      expect(assigned[i.toString()]).not.toEqual(i);
    }
  }
});

it("shuffles big list of participants", () => {
  const size = 10_000;
  const participants = Array.from({ length: size }).map((_, i) =>
    makeParticipant(i.toString()),
  );
  const assigned = shuffleParticipants(participants);
  const keys = Object.keys(assigned).sort();
  expect(keys).toHaveLength(size);
  const values = Object.values(assigned).sort();
  expect(new Set(values).size).toEqual(values.length);
  expect(values).toEqual(keys);
  for (let i = 1; i <= values.length; i++) {
    expect(assigned[i.toString()]).not.toEqual(i);
  }
});

it("enforces minimum number of participants", () => {
  expect(() => shuffleParticipants([])).toThrow("Not enough participants");
  expect(() => shuffleParticipants([makeParticipant("1")])).toThrow(
    "Not enough participants",
  );
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

it("detetects circular exclusions", () => {
  const participants = [
    makeParticipant("1", ["2"]),
    makeParticipant("2", ["3"]),
    makeParticipant("3", ["1", "2"]),
  ];
  expect(() => shuffleParticipants(participants)).toThrow(
    CircularExclusionError,
  );
});
