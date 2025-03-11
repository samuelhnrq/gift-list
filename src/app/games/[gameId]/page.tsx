import AddParticipant from "@/components/AddParticipant";
import ParticipantList from "@/components/ListParticipants";
import { getGame } from "@/lib/games";
import type { GameType } from "@/lib/models";
import { ArrowBack } from "@mui/icons-material";
import { Button, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

type GameDetailProps = {
  params: Promise<{ gameId: string }>;
};

const statusColors = {
  open: "info",
  shuffled: "success",
  closed: "error",
} as const;

function StatusPill({ game }: { game: GameType }) {
  return (
    <Chip
      color={statusColors[game.status]}
      sx={{
        textTransform: "uppercase",
        fontSize: "1rem",
        color: "textSecondary",
      }}
      component="div"
      label={game.status}
    />
  );
}

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
    <Stack gap={{ xs: 1, md: 2 }} padding={2} flex={1} flexWrap="nowrap">
      <Button
        variant="text"
        sx={{ mr: "auto" }}
        href="/games"
        LinkComponent={Link}
        startIcon={<ArrowBack />}
      >
        Games
      </Button>
      <Stack direction="row">
        <Typography variant="h4" flex="1">
          {game.name}
        </Typography>
        <StatusPill game={game} />
      </Stack>
      <AddParticipant game={game} />
      <Typography variant="h6">Participants</Typography>
      <ParticipantList game={game} />
    </Stack>
  );
}

export default GameDetail;
