import {
  getParticipantsOfGame,
  type GameParticipant,
} from "@/lib/participants";
import {
  Avatar,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import ParticipantActions from "./ActionsParticipant";
import type { GameType } from "@/lib/games";
import { Suspense } from "react";

interface ParticipantProps {
  game: GameType;
  participant: GameParticipant;
}

function Participant({ participant, game }: ParticipantProps) {
  return (
    <ListItem
      secondaryAction={<ParticipantActions game={game} ptg={participant} />}
    >
      <ListItemAvatar>
        <Avatar
          src={participant.user?.image || undefined}
          alt={`${participant.user?.name} photo`}
        />
      </ListItemAvatar>
      <ListItemText>
        <Typography>{participant.user?.name || "No name"}</Typography>
        <Typography variant="body2" maxWidth="80%" noWrap>
          {participant.participant.userEmail}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}

interface ParticipantListProps {
  game: GameType;
  sx?: SxProps<Theme>;
}

async function ParticipantList({ game, sx }: ParticipantListProps) {
  const parties = await getParticipantsOfGame(game.id);

  return (
    <Card
      sx={[
        {
          width: "calc(65 * var(--mui-spacing))",
          maxWidth: "100%",
          maxHeight: "50vh",
          overflow: "auto",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <List>
        {parties.map((x) => (
          <Participant key={x.participant?.id} game={game} participant={x} />
        ))}
      </List>
    </Card>
  );
}

function ParticipantSkeleton() {
  return (
    <Card sx={{ width: "calc(65 * var(--mui-spacing))", maxWidth: "100%" }}>
      <List>
        {Array.from({ length: 2 }).map((_, i) => (
          <ListItem key={i}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText>
              <Skeleton width="60%" height={20} />
              <Skeleton width="80%" height={20} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

function ListParticipants(props: ParticipantListProps) {
  return (
    <Suspense fallback={<ParticipantSkeleton />}>
      <ParticipantList {...props} />
    </Suspense>
  );
}

export default ListParticipants;
