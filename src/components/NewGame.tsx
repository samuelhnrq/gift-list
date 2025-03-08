"use client";

import { createGame } from "@/lib/games";
import { Add } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

function NewGame() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab
        color="secondary"
        onClick={() => setOpen(true)}
        sx={{ position: "absolute", bottom: 32, right: 32 }}
      >
        <Add />
      </Fab>
      <Modal keepMounted open={open} onClose={() => setOpen(false)}>
        <Card
          sx={{
            borderRadius: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            maxWidth: "90vw",
            transform: "translate(-50%, -50%)",
          }}
        >
          <form action={createGame}>
            <CardContent sx={{ width: "400px", maxWidth: "100%" }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Create a new game
              </Typography>
              <TextField
                fullWidth
                autoFocus
                label="Game name"
                variant="filled"
                name="name"
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                type="submit"
                sx={{ marginLeft: "auto" }}
                onClick={() => setOpen(false)}
              >
                Create
              </Button>
            </CardActions>
          </form>
        </Card>
      </Modal>
    </>
  );
}

export default NewGame;
