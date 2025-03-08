import { getSession } from "@/auth";
import { Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session?.user?.id) {
    redirect("/games");
  }
  return (
    <>
      <Typography variant="h1">Welcome to Gift List</Typography>
      <Typography variant="h3">Please sign in to continue</Typography>
    </>
  );
}
