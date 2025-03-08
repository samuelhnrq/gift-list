import { getParticipantsOfGame } from "@/lib/participants";
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
import DeleteParticipant from "./DeleteParticipant";
import type { GameType } from "@/lib/games";

type ParticipantType = Awaited<
  ReturnType<typeof getParticipantsOfGame>
>[number];

interface ParticipantProps {
  game: GameType;
  participant: ParticipantType;
}

function Participant({ participant, game }: ParticipantProps) {
  const pid = participant.participant.id;
  return (
    <ListItem
      secondaryAction={<DeleteParticipant game={game} participantId={pid} />}
    >
      <ListItemAvatar>
        <Avatar
          src={participant.user?.image || undefined}
          alt={`${participant.user?.name} photo`}
        />
      </ListItemAvatar>
      <ListItemText>
        <Typography>{participant.user?.name || "No name"}</Typography>
        <Typography variant="body2">
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
          maxHeight: "40vh",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <List>
        {parties.map((x) => (
          <Participant key={x.participant.id} game={game} participant={x} />
        ))}
      </List>
    </Card>
  );
}

export function ParticipantSkeleton() {
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

export default ParticipantList;
