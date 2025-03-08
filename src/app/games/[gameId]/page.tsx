import { getGame } from "@/lib/games";
import { getParticipantsOfGame } from "@/lib/participants";
import { Button, Stack } from "@mui/material";
import Link from "next/link";
import React from "react";

type GameDetailProps = {
  params: Promise<{ gameId: string }>;
};

async function GameDetail({ params }: GameDetailProps) {
  const { gameId } = await params;
  const game = await getGame(gameId);
  const parties = await getParticipantsOfGame(gameId);
  if (!game) {
    return (
      <Stack>
        Game not found!
        <Button href="/games" LinkComponent={Link}>
          Go back
        </Button>
      </Stack>
    );
  }
  return (
    <div>
      {game.name} {parties.length}
      {parties.map((x) => x.user.name).join(", ")}
    </div>
  );
}

export default GameDetail;
