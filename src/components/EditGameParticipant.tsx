"use client";

import type { GameType } from "@/lib/games";
import type { GameParticipant } from "@/lib/participants";
import { Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Exclusions from "./Exclusions";

export type EditGameParticipantProps = {
  game: GameType;
  partipantToGame: GameParticipant;
};

function EditGameParticipant({
  partipantToGame: ptg,
  game,
}: EditGameParticipantProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
      <Dialog
        keepMounted
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle noWrap>
          Edit {ptg.user?.name || ptg.participant.userEmail}
        </DialogTitle>
        <form>
          <DialogContent>
            <Stack gap={2}>
              <TextField
                variant="filled"
                label="Name alias (in this game)"
                fullWidth
              />
              <Exclusions game={game} participant={ptg.participant} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default EditGameParticipant;
