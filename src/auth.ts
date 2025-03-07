import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { admin, jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { copyUserAsParticipant } from "./lib/participants";
import { passkey } from "better-auth/plugins/passkey";
import { headers } from "next/headers";
import { cache } from "react";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing google oauth credentials");
}

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  databaseHooks: {
    user: {
      create: {
        after: copyUserAsParticipant,
      },
    },
  },
  appName: "Gift List",
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [passkey(), nextCookies(), jwt(), admin({})],
});
