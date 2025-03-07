"use client";

import { authClient } from "@/app/auth-client";
import Spinner from "@/icons/Spinner";
import { Button, Typography } from "@mui/material";
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

  async function signOut() {
    setLoading(true);
    await authClient.signOut();
    router.push("/");
    setRefresh(true);
  }

  if (loading) {
    return <Spinner />;
  }

  return user ? (
    <div>
      <Typography variant="body2" display="inline" sx={{ mr: 1 }}>
        Welcome {user?.name}
      </Typography>
      <Button type="button" onClick={signOut} variant="outlined">
        Sign out
      </Button>
    </div>
  ) : (
    <Button variant="outlined" type="button" onClick={singIn}>
      Sign In
    </Button>
  );
}

export default SignInButton;
