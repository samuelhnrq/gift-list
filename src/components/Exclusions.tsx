import type { GameType } from "@/lib/games";
import {
  type GameParticipant,
  getParticipantsOfGame,
} from "@/lib/participants";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export interface ExclusionsProps {
  game: GameType;
  participant: GameParticipant["participant"];
}

function Exclusions({ game, participant }: ExclusionsProps) {
  const [paticipants, setParticipants] = useState<GameParticipant[]>([]);
  useEffect(() => {
    getParticipantsOfGame(game.id).then((participants) => {
      setParticipants(
        participants.filter((x) => participant.id !== x.participant.id),
      );
    });
  }, [game.id, participant.id]);
  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={paticipants}
      getOptionLabel={(option) => option.participant.userEmail}
      defaultValue={[]}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Ecxcluded participants"
          placeholder="Favorites"
        />
      )}
    />
  );
}

export default Exclusions;
