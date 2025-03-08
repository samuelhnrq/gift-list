"use client";

import { authClient } from "@/app/auth-client";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import type { User } from "better-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface SignInButtonProps {
  className?: string;
  user?: User;
}

function AuthState({ user: initialUser }: SignInButtonProps) {
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
    return <CircularProgress size={36} />;
  }

  return user ? (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography
        variant="body2"
        display="inline"
        noWrap
        align="left"
        sx={{ flexShrink: 1, maxWidth: "30vw" }}
      >
        Welcome {user?.name}
      </Typography>
      <Button type="button" onClick={signOut} variant="text" color="secondary">
        <Typography noWrap>Sign out</Typography>
      </Button>
    </Stack>
  ) : (
    <Button variant="contained" type="button" onClick={singIn}>
      Sign In
    </Button>
  );
}

export default AuthState;
