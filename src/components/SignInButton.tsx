"use client";

import { authClient } from "@/app/auth-client";
import Spinner from "@/icons/Spinner";
import type { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface SignInButtonProps {
  className?: string;
  user?: User;
}

function SignInButton({ user: initialUser }: SignInButtonProps) {
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    if (!refresh) return;
    authClient.getSession().then((session) => {
      setUser(session.data?.user);
      setLoading(false);
    });
  }, [refresh]);
  const router = useRouter();

  async function singIn() {
    setLoading(true);
    const { data } = await authClient.signIn.social({
      provider: "google",
    });
    const url = data?.url;
    if (!url) return;
    window.location.href = url;
  }

  async function singOut() {
    setLoading(true);
    await authClient.signOut();
    router.push("/");
    setRefresh(true);
  }

  if (loading) {
    return <Spinner />;
  }

  return user ? (
    <>
      <span className="text-sm font-medium">Welcome {user?.name}</span>
      <button className="button ml-2" type="button" onClick={singOut}>
        Sign out
      </button>
    </>
  ) : (
    <button className="button" type="button" onClick={singIn}>
      Sign In
    </button>
  );
}

export default SignInButton;
