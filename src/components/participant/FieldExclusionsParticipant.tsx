import type { GameParticipant } from "@/lib/models";
import { getParticipantsOfGame } from "@/lib/participants";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useRef, useState, type RefObject } from "react";

export interface ExclusionsProps {
  ptg: GameParticipant;
}

function Exclusions({ ptg }: ExclusionsProps) {
  const [paticipants, setParticipants] = useState<string[]>([]);
  const [selected, setSelected] = useState(ptg.ptg.exclusions);
  const [loading, setLoading] = useState(false);
  const participantMap: RefObject<Record<string, GameParticipant>> = useRef({});
  useEffect(() => {
    setLoading(true);
    setParticipants([]);
    setSelected([]);
    getParticipantsOfGame(ptg.ptg.gameId)
      .then((participants) => {
        setSelected(ptg.ptg.exclusions);
        const people = participants.filter(
          (x) => ptg.ptg.participantId !== x.ptg.participantId,
        );
        participantMap.current = Object.fromEntries(
          people.map((x) => [x.participant.id, x]),
        );
        setParticipants(people.map((x) => x.participant.id));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ptg]);
  return (
    <>
      <Autocomplete
        multiple
        id="tags-standard"
        options={paticipants}
        getOptionLabel={(option) =>
          participantMap.current[option]?.participant.userEmail
        }
        onChange={(_, newValue) => {
          setSelected(newValue);
        }}
        loading={loading}
        value={selected}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Excluded participants"
            placeholder="Favorites"
          />
        )}
      />
      <input type="hidden" name="exclusions" value={selected.join(",")} />
    </>
  );
}

export default Exclusions;
