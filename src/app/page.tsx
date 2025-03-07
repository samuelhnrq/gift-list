import { redirect } from "next/navigation";
import { signIn } from "./auth-client";
import { headers } from "next/headers";
import { auth, getSession } from "@/auth";
import { getCurrentParticipant } from "@/lib/participants";

export default async function Home() {
  const session = await getSession();

  async function loginAction() {
    "use server";
    const { data, error } = await signIn.social({ provider: "google" });
    if (error) return console.log(error);
    const url = data.url;
    if (!url) return;
    redirect(url);
  }

  async function logoutAction() {
    "use server";
    await auth.api.signOut({ headers: await headers() });
  }

  const p = await getCurrentParticipant();
  return (
    <div className="">
      Hello world {session?.user?.name}
      <div>
        Me: {p?.id} {p?.participantGames.length}
      </div>
      <button
        onClick={loginAction}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
      <button
        onClick={logoutAction}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
