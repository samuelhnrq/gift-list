import { BASE_URL } from "@/lib/auth-client";
import type { AssignedNotification } from "@/lib/models";

function EmailTemplate({
  notification,
}: {
  notification: AssignedNotification;
}) {
  let name = "Hello!";
  if (notification.user && notification.ptg.alias) {
    name = `Hello ${notification.user.name} (a.k.a. ${notification.ptg.alias})`;
  } else if (notification.user || notification.ptg.alias) {
    name = `Hello ${notification.user?.name || notification.ptg.alias}`;
  }
  return (
    <div>
      <h1>{name}</h1>
      <p>
        You have been assigned a partner in game {notification.game.name}. You
        can view the game
        <a href={`${BASE_URL}/games/${notification.game.id}`}> here</a>.
        <br />
        <br />
        <p>Your partner is {notification.ptg.givesTo}</p>
        <br />
      </p>
    </div>
  );
}

export default EmailTemplate;
