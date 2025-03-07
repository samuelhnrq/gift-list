import { getSession } from "@/auth";
import { getCurrentParticipant } from "@/lib/participants";

export default async function Home() {
  const session = await getSession();

  const p = await getCurrentParticipant();
  return (
    <div className="">
      Hello world {session?.user?.name}
      <div>
        Me: {p?.id} {p?.participantGames.length}
      </div>
    </div>
  );
}
