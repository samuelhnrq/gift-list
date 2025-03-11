"use server";

import { Resend } from "resend";
import type { AssignedNotification } from "./models";
import EmailTemplate from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyParticipant(assigned: AssignedNotification) {
  const recipient = assigned.participant.userEmail;
  const game = assigned.game;
  return resend.emails.send({
    from: "gift-list@slva.fr",
    to: recipient,
    subject: `You have been assigned to a game: ${game.name}`,
    react: EmailTemplate({ notification: assigned }),
  });
}
