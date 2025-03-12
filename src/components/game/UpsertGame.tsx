"use client";

import { upsertGameAction } from "@/lib/games";
import { GameType } from "@/lib/models";
import { Add, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";

export interface EditGameProps {
  game?: GameType;
}

function UpsertGame({ game }: EditGameProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (form: FormData) => {
      setLoading(true);
      await upsertGameAction(game?.id || "", form);
      setLoading(false);
      setOpen(false);
    },
    [game],
  );

  return (
    <>
      {game ? (
        <IconButton onClick={() => setOpen(true)}>
          <Edit />
        </IconButton>
      ) : (
        <Fab
          onClick={() => setOpen(true)}
          color="secondary"
          sx={{ position: "absolute", right: 32, bottom: 32 }}
        >
          <Add />
        </Fab>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <form action={submit}>
          <DialogTitle>Create a new game</DialogTitle>
          <DialogContent>
            <input type="hidden" name="gameId" value={game?.id} />
            <TextField
              fullWidth
              required
              autoFocus
              defaultValue={game?.name}
              label="Game name"
              variant="filled"
              name="name"
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              color="secondary"
              loading={loading}
              sx={{ marginLeft: "auto" }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default UpsertGame;
