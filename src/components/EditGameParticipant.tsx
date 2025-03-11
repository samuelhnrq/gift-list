"use client";

import { updateParticipantGameAction } from "@/lib/participants";
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
import {
  useState,
  useActionState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Exclusions from "./Exclusions";
import type { GameParticipant } from "@/lib/models";

export type EditGameParticipantProps = {
  ptg: GameParticipant;
};

function EditGameParticipant({ ptg }: EditGameParticipantProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [, updateAction, isPending] = useActionState(
    updateParticipantGameAction,
    ptg,
  );
  const handleSubmit = useCallback(
    (formData: FormData) => {
      updateAction(formData);
      setOpen(false);
    },
    [updateAction],
  );
  useEffect(() => {
    if (open) {
      formRef.current?.reset();
    }
  }, [open]);
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
        <DialogTitle noWrap sx={{ pb: 0 }}>
          Edit {ptg.user?.name || ptg.participant.userEmail}
        </DialogTitle>
        <form action={handleSubmit} ref={formRef}>
          <DialogContent>
            <Stack gap={2}>
              <TextField
                variant="filled"
                name="alias"
                label="Name alias (in this game)"
                defaultValue={ptg.ptg.alias}
                fullWidth
              />
              <Exclusions ptg={ptg} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" loading={isPending}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default EditGameParticipant;
