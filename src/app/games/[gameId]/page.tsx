import AddParticipant from "@/components/AddParticipant";
import ParticipantList, {
  ParticipantSkeleton,
} from "@/components/ParticipantList";
import { getGame } from "@/lib/games";
import { ArrowBack } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React, { Suspense } from "react";

type GameDetailProps = {
  params: Promise<{ gameId: string }>;
};

async function GameDetail({ params }: GameDetailProps) {
  const { gameId } = await params;
  const game = await getGame(gameId);
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
    <Stack gap={{ xs: 1, md: 2 }} padding={2} maxHeight="100%">
      <Button
        variant="text"
        sx={{ mr: "auto" }}
        href="/games"
        LinkComponent={Link}
        startIcon={<ArrowBack />}
      >
        Games
      </Button>
      <Typography variant="h4">{game.name}</Typography>
      <AddParticipant game={game} />
      <Typography variant="h6">Participants</Typography>
      <Suspense fallback={<ParticipantSkeleton />}>
        <ParticipantList game={game} sx={{ overflow: "auto" }} />
      </Suspense>
    </Stack>
  );
}

export default GameDetail;
