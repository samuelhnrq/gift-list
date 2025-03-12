import { BASE_URL } from "@/lib/auth-client";
import type { AssignedNotification } from "@/lib/models";

function getName(target: AssignedNotification): string {
  if (target.user && target.ptg.alias) {
    return `${target.user.name} (a.k.a. ${target.ptg.alias})`;
  } else if (target.user?.name || target.ptg.alias) {
    return target.user?.name || target.ptg.alias || "";
  } else {
    return target.participant.userEmail;
  }
}

function EmailTemplate({
  from,
  to,
}: {
  from: AssignedNotification;
  to: AssignedNotification;
}) {
  let name = getName(from);
  let nameTo = getName(to);
  return (
    <div>
      <h2>Hello {name}</h2>
      <p>
        You have been assigned a partner in game {from.game.name}. You can view
        the game
        <a href={`${BASE_URL}/games/${from.game.id}`}> here</a>.
        <br />
        <br />
        <p>Your partner is {nameTo}</p>
        <br />
      </p>
    </div>
  );
}

export default EmailTemplate;
