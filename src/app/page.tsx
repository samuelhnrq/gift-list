import { redirect } from "next/navigation";
import { signIn } from "./auth-client";
import { headers } from "next/headers";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

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
  return (
    <div className="">
      Hello world {session?.user?.name}
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
